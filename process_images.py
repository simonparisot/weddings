from PIL import Image
import os
import glob

def process_image(input_path, output_path):
    try:
        # Open the image
        with Image.open(input_path) as img:
            # Convert to RGB if necessary (for PNG with transparency)
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                img = img.convert('RGB')
            
            # Get current dimensions
            width, height = img.size
            
            # Instagram aspect ratio is 1:1 (square) or 4:5 (portrait)
            # We'll use 4:5 as it's more versatile
            target_ratio = 4/5
            
            # Calculate new dimensions
            if width/height > target_ratio:
                # Image is too wide
                new_width = int(height * target_ratio)
                new_height = height
                left = (width - new_width) // 2
                top = 0
                right = left + new_width
                bottom = height
            else:
                # Image is too tall
                new_width = width
                new_height = int(width / target_ratio)
                left = 0
                top = (height - new_height) // 2
                right = width
                bottom = top + new_height
            
            # Crop the image
            img = img.crop((left, top, right, bottom))
            
            # Resize to Instagram's recommended size (1080x1350)
            img = img.resize((1080, 1350), Image.Resampling.LANCZOS)
            
            # Save as WebP with quality 80 (good balance between quality and size)
            img.save(output_path, 'WEBP', quality=80)
            
            print(f"Processed {os.path.basename(input_path)} -> {os.path.basename(output_path)}")
    except Exception as e:
        print(f"Error processing {input_path}: {str(e)}")

def main():
    # Create output directory if it doesn't exist
    output_dir = "blancheetantoine.fr/img/list/processed"
    os.makedirs(output_dir, exist_ok=True)
    
    # Process all images in the list directory
    input_dir = "blancheetantoine.fr/img/list"
    image_files = glob.glob(os.path.join(input_dir, "*.*"))
    
    for input_path in image_files:
        # Skip if it's already a processed WebP file
        if input_path.endswith('.webp') and 'processed' in input_path:
            continue
            
        # Create output filename
        filename = os.path.basename(input_path)
        name, ext = os.path.splitext(filename)
        output_path = os.path.join(output_dir, f"{name}.webp")
        
        process_image(input_path, output_path)

if __name__ == "__main__":
    main() 