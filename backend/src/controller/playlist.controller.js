import {db} from "../libs/db.js"
export const createPLaylist = async( req, res)=>{}
export const getAllListDetails = async (req, res)=> {}
export const getPlaylistDetails = async (req, res)=> {
    const {playlistsID} = req.params;
    try{
        const playlist = await db.playlist.findUnique({
            where:{
                id:playlistsID,
                userId:req.user.id
            }
        })

    }catch{
 
    }

}
