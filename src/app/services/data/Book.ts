import { Author } from "./Author";

export class Book{
   id!: Number;
   title:String;
   cover: String;
   author: Author;
   description:String;



   constructor ( title:String , cover :String , author:Author ,description: String ){
       
       this.title=title;
       this.cover=cover;
       this.author=author;
       this.description=description;
   }
}

