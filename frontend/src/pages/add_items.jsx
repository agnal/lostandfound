import ItemForm from '../components/itemForm';
import { useLocation } from "react-router-dom";
const AddItems = () => {
const location = useLocation();
//   const [editingItem, setEditingItem] = useState(null);
const { item } = location.state || {};
  return (
    <div className="container mx-auto p-6 relative">
      <ItemForm
      
       item={item}
      />

    
    </div>
  );
};

export default AddItems;

