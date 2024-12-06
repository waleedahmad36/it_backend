import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPaid: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  discountPrice: { type: Number },
  duration: { type: Number, required: true, min: 0 },
  thumbnail: { type: String, default: "" },
  videoUrl: { type: String, default: "" },
  pdfUrl: { type: String, default: "" },
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
export default Course;












// nhi ho pa rha issue solve , aisa kro isko choro m tme requirement bta deta ho , complete code , files ki form m agr de do to ziada bhtr h , m chahta user course create kr sky , jesy oper model h kch is tra se hi , mostly model fields yhi hngi i think , user choose kr sky , one shot model create kr sky , as a playlist b kr sky , ya phr isko simple krty hein , create one shot hi kry , lkn osko pass power ho aik new playlist create kry , or video p click kr k add to playlist ka option osy mil jyee , jo k osne exisiting playlist bna rkhi hein , i think ye bhtr way hoga , so please complete it , course m aik cheez make sure krna course agr free h to thk , lkn agr paid h , to do options show hn , orignal price add kr sky , or dsri agr vo discounted price b add krna chahy to vo b kr sky , thumbnail , video , pdf , duration , title , description , price and discount paid , intructor , jo k ref hoga usermodel ka , ta k hmary pass record ho , k kon owner h is course ka , const CourseCreationForm = ({ user }) => { frontend m hr component m logged in user already h , so hm create k time just user._id is tra se de dein gy , owner ki id ,, models i think 2 bnien gy aik course ka or dsra playlist ka , or phr dono apaas m connected hngy , fields is tra se handle krna models m , k update k time issue na ayee , update b to krna h na hmien , user apny courses update kr sky , or playlist b control kr sky , create playlist kr sky , add course to playlist kr sky , remove from playlist kr sky , so write all the backend and frontend , it should be complete and no bug should be there now