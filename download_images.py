import requests
import os
from urllib.parse import urlparse
import time

def download_image(url, filename):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, stream=True)
        response.raise_for_status()
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        
        with open(filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Successfully downloaded {filename}")
    except Exception as e:
        print(f"Error downloading {url}: {str(e)}")

def get_unsplash_image(url):
    try:
        image_id = url.split('/')[-1]
        # Use Unsplash API to get the image URL
        api_url = f"https://api.unsplash.com/photos/{image_id}"
        headers = {
            'Authorization': 'Client-ID YOUR_UNSPLASH_ACCESS_KEY'  # You'll need to replace this with a real Unsplash API key
        }
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        data = response.json()
        image_url = data['urls']['regular']
        filename = os.path.join("blancheetantoine.fr", "img", "list", f"unsplash_{image_id}.jpg")
        download_image(image_url, filename)
    except Exception as e:
        print(f"Error processing Unsplash URL {url}: {str(e)}")

# List of URLs to process
urls = [
    "https://www.michelvaillant.com/les-albums/le-grand-defi-5502700",
    "https://www.laredoute.fr/ppdp/prod-509093315.aspx#searchkeyword=serviette%20table%20lin%20&shoppingtool=search",
    "https://www.laredoute.fr/ppdp/prod-548847121.aspx#searchkeyword=jeux%20de%20societe&shoppingtool=search",
    "https://www.laredoute.fr/ppdp/prod-601938986.aspx#searchkeyword=shaker&shoppingtool=search",
    "https://www.laredoute.fr/ppdp/prod-552216803.aspx#headerSearchContainer&searchkeyword=Nappes%20lin&shoppingtool=search",
    "https://www.christofle.com/eu_fr/rond-de-serviette-babylone-metal-argente-b04260300.html",
    "https://www.laredoute.fr/ppdp/prod-602018896.aspx#searchkeyword=verres%20a%20eau&shoppingtool=search",
    "https://www.laredoute.fr/ppdp/prod-552436463.aspx#searchkeyword=chaises&shoppingtool=search",
    "https://unsplash.com/fr/photos/une-radio-posee-sur-une-table-rouge-8jItkQDsswU",
    "https://www.bonsoirs.com/fr-fr/products/parure-percale-lavee-coup-de-coeur-vert",
    "https://unsplash.com/fr/photos/femme-en-pantalon-noir-et-bottes-noires-assise-sur-la-balancoire-sur-leau-pendant-la-journee-n4kfGQWT7XA",
    "https://www.bonsoirs.com/fr-fr/products/set-de-bain-nid-dabeille-bleu",
    "https://unsplash.com/fr/photos/tasse-a-the-en-ceramique-blanche-sur-soucoupe-YRkZ-oBrNss",
    "https://www.laredoute.fr/ppdp/prod-512689360.aspx#searchkeyword=table%20basse&shoppingtool=search",
    "https://www.lamarzocco.com/fr/fr/produits-pour-la-maison/machines-a-espresso/linea-mini-r/",
    "https://www.laredoute.fr/ppdp/prod-552263135.aspx#searchkeyword=bibliotheque&shoppingtool=search",
    "https://www.lasultanedesaba.com/products/modelage-for-two-fragrance-musk-incense-vanilla",
    "https://www.laredoute.fr/ppdp/prod-559729566.aspx#searchkeyword=fauteuil&shoppingtool=search",
    "https://unsplash.com/fr/photos/une-personne-tirant-une-valise-jaune-sur-roues-mdcFyvBHLc8",
    "https://unsplash.com/fr/photos/un-plongeur-nage-dans-une-grotte-sous-marine-yx7TJle8LhM",
    "https://www.christofle.com/eu_fr/ensemble-pour-6-personnes-36-pieces-en-acier-avec-ecrin-offert-02416735000001.html",
    "https://unsplash.com/fr/photos/camera-noire-sur-table-en-bois-marron-jYiY2114mn4",
    "https://unsplash.com/fr/photos/un-chemin-de-terre-au-milieu-dune-foret-iAtOXFHG0D0",
    "https://unsplash.com/fr/photos/une-table-garnie-dassiettes-et-de-bols-remplis-de-citrons-PApJYy6tmWc",
    "https://www.barbour.com/barbour-classic-beadnellr-wax-jacket-olive",
    "https://www.barbour.com/catalog/product/view/id/171489/s/tracker-lightweight-waxed-jacket/category/74/",
    "https://unsplash.com/fr/photos/personne-en-veste-noire-et-pantalon-noir-montant-sur-le-snowboard-pendant-la-journee-weFx9RflIfU",
    "https://www.laredoute.fr/ppdp/prod-512499030.aspx#searchkeyword=table%20salle%20a%20manger&shoppingtool=search",
    "https://www.guysavoy.com/",
    "https://www.laredoute.fr/ppdp/prod-601227748.aspx#searchkeyword=pipistrellon&shoppingtool=search"
]

# Process each URL
for i, url in enumerate(urls):
    try:
        if 'unsplash.com' in url:
            get_unsplash_image(url)
        else:
            filename = os.path.join("blancheetantoine.fr", "img", "list", f"image_{i}.jpg")
            download_image(url, filename)
        time.sleep(1)  # Add a small delay between requests
    except Exception as e:
        print(f"Error processing URL {url}: {str(e)}") 