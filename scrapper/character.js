const axios = require("axios");
const cheerio = require("cheerio");

base_url = "https://myanimelist.net/character.php?q=";

class Character {
  constructor(name) {
    this.name = name;
  }
  results = [];
  getLinks() {
    const url = (base_url += this.name);
    const result = axios.get(base_url).then((response) => {
      const links = [];

      const $ = cheerio.load(response.data);

      $("td.borderClass.bgColor1").each((i, el) => {
        if ($(el).attr("width") === "175") {
          const link = $(el).find("a");
          links.push($(link).attr("href"));

        }
      });
      return links
    });
    return result;
  }

  getInfo() {
    const header = {
        "Content-Type": "application/json"
    }
      const links = this.getLinks()
      
      .then(res=>{
          res.forEach(link=>{
              
              axios.get(link,{},header)
              .then(response=>{
                  const $ = cheerio.load(response.data)
                  $("h2.normal_header").each((i,el)=>{
                      const full_name = $(el).text()
                      const name = full_name.split("(")
                      const romaji = name[0]
                      const japanease = name[1]
                     
                  })
                  const table = $("td")
                  console.log(table.text())
                  
              })
          })
      })

  }
}

axios.get("https://anilist.co/character/89311/Yuuji-Terushima")
.then(res=>{
    const $ = cheerio.load(res.data)
    const description = $(".description-wrap")
    console.log(description.text())
})

axios.get("https://anilist.co/search/characters?search=bell")
.then(res=>{
    const $ = cheerio.load(res.data)
    const name = $(".name")
    console.log(name.text())
})
    
