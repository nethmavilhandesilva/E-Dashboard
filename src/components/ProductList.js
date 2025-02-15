import React, { useEffect, useState } from "react";

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            let result = await fetch('http://localhost:5000/products');
            result = await result.json();
            setProducts(result);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    console.warn(products);

    return (
        <div className="product-list">
            <h3>Product List</h3>
            <ul>
                <li><strong>S. No.</strong></li>
                <li><strong>Name</strong></li>
                <li><strong>Price</strong></li>
                <li><strong>Category</strong></li>
            </ul>

            {products.length > 0 ? (
                products.map((item, index) => (
                    <ul key={index}>
                        <li>{index + 1}</li>
                        <li>{item.name}</li>
                        <li>{item.price}</li>
                        <li>{item.category}</li>
                    </ul>
                ))
            ) : (
                <p>No products found</p>
            )}
        </div>
    );
};

export default ProductList;
