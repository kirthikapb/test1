const{MongoClient}=require("mongodb")

module.exports={
    db:{},
    async connect() {   
    
    try{
    const client=await MongoClient.connect(process.env.Mongo_URL)
        
    this.db=client.db(process.env.Mongo_DB)
     console.log(this.db)
    }
    catch(err)
    {
        console.log(err)
    }
}
}

