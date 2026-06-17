import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from './secret';

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true, 
});

export default cloudinary;



// const buffer = Buffer.from(await imageFile.arrayBuffer());
//         const cloudImage = await new Promise((resolve, reject) => {
//             const stream = cloudinary.uploader.upload_stream({
//                     folder: "projects",
//                     public_id: slug, 
//                     use_filename: true,   
//                     unique_filename: false 
//                 }, (err, result) => { if (err) reject(err); else resolve(result); });
//             stream.end(buffer);
//         });