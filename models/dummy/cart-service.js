// const Cart = require('./cart'); 
// // @ts-ignore
// const CartItem = require('./cartItem');

// class CartService {
//   static async addProduct(cartId, productId, price, action = 'increase') {
//     const cart = await Cart.findByPk(cartId, {
//       include: CartItem,
//     });

//     if (!cart) {
//       throw new Error("Cart not found");
//     }

//     // Find the product in the cart items
//     // @ts-ignore
//     const cartItem = cart.CartItems.find(item => item.productId === productId);

//     if (cartItem) {
//       if (action === 'increase') {
//         cartItem.qty++;
//       } else if (action === 'decrease' && cartItem.qty > 1) {
//         cartItem.qty--;
//       } else if (action === 'decrease' && cartItem.qty === 1) {
//         await cartItem.destroy();
//       }
//     } else {
//       // Add new item to cart
//       await CartItem.create({
//         // @ts-ignore
//         cartId: cart.id,
//         productId,
//         qty: 1,
//         price,
//       });
//     }

//     // Recalculate the total price
//     // @ts-ignore
//     const updatedCart = await Cart.findByPk(cart.id, {
//       include: CartItem,
//     });

//     // @ts-ignore
//     cart.totalPrice = updatedCart.CartItems.reduce((total, item) => {
//       return total + item.price * item.qty;
//     }, 0);

//     await cart.save();
//   }

//   static async getCart(cartId) {
//     return await Cart.findByPk(cartId, {
//       include: CartItem, // Include CartItems
//     });
//   }

//   static async removeProduct(cartId, productId) {
//     const cart = await Cart.findByPk(cartId, {
//       include: CartItem, // Include CartItems associated with this Cart
//     });

//     if (!cart) {
//       throw new Error("Cart not found");
//     }

//     // @ts-ignore
//     const cartItem = cart.CartItems.find(item => item.productId === productId);

//     if (cartItem) {
//       // Remove the product from the cart
//       // @ts-ignore
//       cart.totalPrice -= cartItem.price * cartItem.qty;
//       await cartItem.destroy();
//       await cart.save();
//     } else {
//       throw new Error("Product not found in the cart");
//     }
//   }
// }

// module.exports = CartService;