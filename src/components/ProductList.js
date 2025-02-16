import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            let result = await fetch('http://localhost:5000/products');
            result = await result.json();
            authorization:JSON.parse(localStorage.getItem('token'))
            setProducts(result);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            let response = await fetch(`http://localhost:5000/product/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setProducts(products.filter(product => product._id !== id)); // Remove from UI
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const searchHandle = async (event) => {
        let key = event.target.value;
        if(key){
        let result= await fetch(`http://localhost:5000/search/${key}`);
        result = await result.json
        if(result){
            setProducts(result)
        }
    }else{
        getProducts();
    }
    };

    return (
        <div className="product-list">
            <h3>Product List</h3>
            <input type="text" className="search-product-box" placeholder="Search Product"
                onChange={searchHandle} />
            
            <ul>
                <li><strong>S. No.</strong></li>
                <li><strong>Name</strong></li>
                <li><strong>Price</strong></li>
                <li><strong>Category</strong></li>
                <li><strong>Operation</strong></li>
            </ul>

            {products.length > 0 ? (
                products.map((item, index) => (
                    <ul key={item._id}>
                        <li>{index + 1}</li>
                        <li>{item.name}</li>
                        <li>{item.price}</li>
                        <li>{item.category}</li>
                        <li>
                            <button onClick={() => deleteProduct(item._id)}>Delete</button>
                            <Link to={"/update/" + item._id}>Update</Link>
                        </li>
                    </ul>
                ))
            ) : (
                <p>No products found</p>
            )}
        </div>
    );
};

export default ProductList;
