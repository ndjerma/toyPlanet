import { CartItem as CartItemType } from '../../types';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  return (
    <div>
      <h2>{item.toy.naziv}</h2>
    </div>
  );
};

export default CartItem;
