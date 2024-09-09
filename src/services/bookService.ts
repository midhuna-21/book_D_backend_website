import { BookRepository } from "../respository/bookRepository";
import {Books, Order} from '../interfaces/data'
import {IBooks} from '../model/bookModel'


const bookRepository =new BookRepository()

export class BookService{
 
    async getAddToBookRent(bookRentData:Books):Promise<IBooks | null>{
        try{
            console.log(bookRentData,'servise')
            return await bookRepository.addToBookRent(bookRentData)
        }catch(error){
            console.log("Error getAddToBookRent:",error);
            throw error
        }
    }

    async getUpdateBookRent(bookRentData:Books,bookId:string):Promise<IBooks | null>{
        try{
            return await bookRepository.updateBookRent(bookRentData,bookId)
        }catch(error){
            console.log("Error geUpdateBookRent:",error);
            throw error
        }
    }

    async getAddToBookSell(bookSelldata:Books):Promise<IBooks | null>{
        try{
            return await bookRepository.addToBookSell(bookSelldata)
        }catch(error){
            console.log("Error getAddToBookSell:",error);
            throw error
        }
    }

    async getAllGenres(){
        try{
            return await bookRepository.findAllGenres()
        }catch(error){
            console.log("Error getAllGenres:",error);
            throw error
        }
    }

    async getAllBooks(){
        try{
            const books =  await bookRepository.findAllBooks()
            console.log(books,'books')
            return books
        }catch(error){
            console.log("Error getAllBooks:",error);
            throw error
        }
    }

    async getBookById(bookId:string): Promise<IBooks | null> {
        try{
            return await bookRepository.findBook(bookId)
        }catch(error:any){
            console.log("Error getBook:",error)
            throw error
        }
    }

    async getOrders(userId:string){
      try{
          return await bookRepository.findOrders(userId)
      }catch(error){
          console.log("Error getOrders:",error)
          throw error
      }
  }

  async getCreateOrderProcess(data:Order){
   try{
       return await bookRepository.findCreateOrderProcess(data)
   }catch(error){
       console.log("Error getCreateOrderProcess:",error)
       throw error
   }
}
async getCreateOrder(userId:string,bookId:string){
   try{
       return await bookRepository.findCreateOrder(userId,bookId)
   }catch(error){
       console.log("Error getCreateOrder:",error)
       throw error
   }
}

async getSearchResult(searchQuery:string){
    try{
        return await bookRepository.findSearchResult(searchQuery)
    }catch(error){
        console.log("Error getSearchResult:",error)
        throw error
    }
 }
}
