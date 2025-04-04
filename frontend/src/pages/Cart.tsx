import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';

import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, decrementInCart, incrementInCart } from '../redux/cartSlice';

import ProductDetails from '../widgets/ProductDetails';

import { GB_CURRENCY } from '../utils/constans';

// import EmptyCartWidget from '../widgets/EmptyCartWidget';

const Cart = () => {
  const products = useSelector((state: any) => state.cartSlice.products);
  const itemsNumber = useSelector((state: any) => state.cartSlice.productsNumber);
  const subtotal = useSelector((state: any) =>
    state.cartSlice.products.reduce(
      (subtotal: any, product: any) => subtotal + product.price * product.quantity,
      0,
    ),
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/users/order',
        {
          items: products,
          total: subtotal,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      message.success('Order placed successfully! 🎉');
      navigate('/profile');
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        message.error('Order endpoint not found. Please check the server URL.');
      } else {
        message.error('Failed to place order');
      }
      console.error('Error placing order', error);
    }
  };

  return (
    <div className="h-screen bg-amazonColors-background">
      <div className="min-w-[1000px] max-w-[1500px] m-auto pt-8">
        <div className="grid grid-cols-8 gap-10">
          {/* Products */}
          <div className="col-span-6 bg-white">
            <div className="text-2xl xl:text-3xl m-4">Shopping Cart</div>
            {products.map((product: any) => {
              return (
                <div key={product.id}>
                  <div className="grid grid-cols-12 divide-y divide-gray-400 mr-4">
                    <div className="col-span-10 grid grid-cols-8 divide-y divide-gray-400">
                      <div className="col-span-2">
                        <Link to={`/product/${product.id}`}>
                          <img
                            className="p-4 m-auto"
                            src={product.image_small}
                            alt="Checkout product"
                          />
                        </Link>
                      </div>
                      <div className="col-span-6">
                        <div className="font-medium text-black mt-2">
                          <Link to={`/product/${product.id}`}>
                            <ProductDetails product={product} ratingsIs={false} />
                          </Link>
                        </div>
                        <div>
                          <button
                            className="text-sm xl:text-base font-semibold rounded text-blue-500 mt-2 mb-1 cursor-pointer"
                            onClick={() => dispatch(removeFromCart(product.id))}>
                            Delete
                          </button>
                        </div>
                        <div className="grid grid-cols-3 w-20 text-center">
                          <div
                            className="text-xl xl:text-2xl bg-gray-400 rounded cursor-pointer"
                            onClick={() => dispatch(decrementInCart(product.id))}>
                            -
                          </div>
                          <div className="text-lg xl:text-xl bg-gray-200">
                            {parseInt(product.quantity)}
                          </div>
                          <div
                            className="text-xl xl:text-2xl bg-gray-400 rounded cursor-pointer"
                            onClick={() => dispatch(incrementInCart(product.id))}>
                            +
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-lg xl:text-xl mt-2 mr-4 font-semibold">
                        {GB_CURRENCY.format(product.price)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="text-lg xl:text-xl text-right mb-4 mr-4">
              Subtotal ({itemsNumber} items):{' '}
              <span className="font-semibold">{GB_CURRENCY.format(subtotal)}</span>
            </div>
          </div>
          {/* Checkout */}
          <div className="col-span-2 bg-white rounded h-[250px] p-7">
            <div className="text-xs xl:text-sm text-green-800 mb-2">
              Your order qualifies for <span className="font-bold">FREE DELIVERY</span>. Delivery
              Details
            </div>
            <div className="text-base xl:text-lg mb-4">
              Subtotal ({itemsNumber} items):{' '}
              <span className="font-semibold">{GB_CURRENCY.format(subtotal)}</span>
            </div>
            <button className="btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
