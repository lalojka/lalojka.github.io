// ne_con_GOVT_CN.mjs
const fetchData = () => {
    // URL de la API

    const metrica = 'NY.GDP.DEFL.KD.ZG';
    const url1 = `https://api.worldbank.org/v2/country/all/indicator/${metrica}?format=jsonstat`;

  
    // Hacer la solicitud HTTP a la API y obtener la respuesta en formato JSONstat
    return fetch(url1)
      .then(response => response.json())
      .then(json_data => {
        // Assuming you already have the JSON response stored in a variable named json_data

            const data = json_data["WDI"]["value"];
            const seriesLabel = json_data["WDI"]["dimension"]["series"]["category"]["label"][metrica];
            const source = json_data["WDI"]["source"];
            const updated = json_data["WDI"]["updated"];
            const countryLabels = json_data["WDI"]["dimension"]["country"]["category"]["label"];
            const years = Object.keys(json_data["WDI"]["dimension"]["year"]["category"]["label"]);

            const structuredData = [];

            
            for (let i = 0; i < data.length; i++) {
                const countryIndex = Math.floor(i / (years.length));
                const yearIndex = i % years.length;
                const country = countryLabels[Object.keys(countryLabels)[countryIndex]];
                const year = years[yearIndex];
                const value = data[i];

                const dataPoint = {
                    Source: source,
                    Updated: updated,
                    Series: seriesLabel,
                    Country: country,
                    Year: year,
                    Value: value,
                };


                structuredData.push(dataPoint);
                
            }
            
            

            // Now, structuredData contains the desired data structure with multiple countries
            

 

        return { structuredData }; // Devuelve los datos procesados y seriesCategory
    });
    
    
};


export default fetchData;


