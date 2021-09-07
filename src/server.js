import { belongsTo, createServer, hasMany, Model } from "miragejs"

createServer({
   models:{
        club: Model.extend({
          players: hasMany(), // 1 clb có nhiều cầu thủ
        }),
        player: Model.extend({
          club: belongsTo(),  // 1 cầu thủ chỉ thuộc 1 clb
        })
   },


   // Tạo ra dữ liệu ảo (dữ liệu cứng)
   seeds(server) {
    const mane = server.create("player",{name:"Sadio Mane"}) 
    const aubameyang = server.create("player",{name:"Pierre-Emerick Aubameyang"}) 
    const werner = server.create("player",{name:"Timo Werner"}) 
    const salah = server.create("player",{name:"Mohamed Salah"}) 
    const saka = server.create("player",{name:"Bukayo Saka"}) 
    const partey = server.create("player",{name:"Thomas Partey"}) 
    const mount = server.create("player",{name:"Mason Mount"}) 
    server.create("club", { id: "1", name: "Liverpool", cups: 19, players: [mane,salah]})
    server.create("club", { id: "2", name: "Arsenal", cups: 13, players: [aubameyang,partey,saka]})
    server.create("club", { id: "3", name: "Chelsea", cups: 6, players: [mount,werner]})
  },

  routes() {
   this.namespace = 'api' // Thêm /api vào đường dẫn

    // this.post("/clubs", (schema, request) => {
    // let attrs = JSON.parse(request.requestBody)
    // attrs.id = Math.floor(Math.random() * 100)
    // clubs.push(attrs)
    // return { club: attrs }
    // }) 

    // this.get("/clubs", () => {
    //     return{
    //         clubs
    //     }
    // })

    this.get("/clubs", (schema, request) => {
        return schema.clubs.all()
      })
    
    this.get("/clubs/:id", (schema, request) => {
      let id = request.params.id
      return schema.clubs.find(id)
    })

    this.get("/clubs/:id/players", (schema, request) => {
      let club = schema.clubs.find(request.params.id)
      return club.players
    })
    
    this.post("/clubs", (schema, request) => {
      let attrs = JSON.parse(request.requestBody)
      return schema.clubs.create(attrs)
    })
    
    this.patch("/clubs/:id", (schema, request) => {
      let newAttrs = JSON.parse(request.requestBody)
      let id = request.params.id
      let club = schema.clubs.find(id)
      return club.update(newAttrs)
    })
    
    this.delete("/clubs/:id", (schema, request) => {
      let id = request.params.id
      return schema.clubs.find(id).destroy()
    })
  },
})

