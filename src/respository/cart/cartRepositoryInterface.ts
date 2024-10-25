import { IUser } from '../../model/userModel';
import { IGenre } from '../../model/genresModel';
import { IBooks } from '../../model/bookModel';
import { IAdmin } from '../../model/adminModel';
import { IBookWalletTransaction } from '../../model/bookDWallet';
import { IOrder } from '../../model/orderModel';
import {User,Genre,Admin, Cart} from '../../interfaces/data';
import { ICart } from '../../model/cartModel';

export interface ICartRepository {
   findCreatCart(data: Cart): Promise<ICart | null> 
   findCheckRequest(
      userId: string,
      bookId: string
  ): Promise<ICart | null>
  findCheckAccept(userId: string, bookId: string): Promise<boolean>
  findCartById(cartId: string):Promise<ICart | null>
  findUpdateCart(cartId: string, types: string):Promise<ICart | null>
  findCartDetails(cartId: string):Promise<ICart | null>
  findUpdateIsPaid(cartId: string):Promise<ICart | null>
}
