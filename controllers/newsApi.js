import * as api from "../Api/newsApi.js";

export const getNews = async (req,res) => {
    try{
       const {data} = await api.getNews();
       res.status(200).send(data.articles);
    }catch(err) {
       console.log(err);
    }
}