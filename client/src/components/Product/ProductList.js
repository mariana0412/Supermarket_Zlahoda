import React, {useEffect, useRef, useState} from 'react';
import {
    Button,
    ButtonGroup,
    Container,
    FormGroup,
    Input, Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Table
} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';
import '../../App.css';
import useAuth from "../../hooks/useAuth";
import SearchByNameModal from "./SearchByNameModal";
import {useReactToPrint} from "react-to-print";
import useLastPath from "../../hooks/useLastPath";

const ProductList = () => {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [modalNumberSold, setModalNumberSold] = useState(false);
    const [modalSearchByName, setModalSearchByName] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [numberSold, setNumberSold] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [searchProductName, setSearchProductName] = useState('');
    const [productsFoundByName, setProductsFoundByName] = useState(null);
    const [showEmpty, setShowEmpty] = useState(false);
    const {auth} = useAuth();
    useLastPath();
    const componentPDF = useRef();

    useEffect(() => {
        let url = `api/products`;
        if(selectedCategory === 'allCategories')
            url += `?sorted=true`;
        else if(selectedCategory)
            url += `?categoryId=` + selectedCategory;

        fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }
        })
            .then(response => {
                if (response.status === 204)
                    return null;
                else
                    return response.json();
            })
            .then(data => {
                if (data) {
                    setProducts(data);
                    setShowEmpty(data.length === 0);
                } else {
                    setProducts([]);
                    setShowEmpty(true);
                }
            })

        fetch(`/api/categories`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => response.json())
            .then(data => setCategories(data));
    }, [selectedCategory]);

    const remove = async (id) => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                let updatedProducts = [...products].filter(i => i.id_product !== id);
                setProducts(updatedProducts);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const productList = products.map(product => {
        const categoryName = categories.find(cat => cat.category_number === product.category_number)?.category_name;
        return <tr key={product.id_product}>
            <td style={{whiteSpace: 'nowrap'}}>{product.product_name}</td>
            <td>{categoryName}</td>
            <td>{product.characteristics}</td>
            { auth?.role === "MANAGER"
                &&
                <td>
                    <ButtonGroup>
                        <Button className="buttonWithMargins" size="sm" color="primary" tag={Link} to={"/products/" + product.id_product}>Edit</Button>
                        <Button className="buttonWithMargins" size="sm" color="danger" onClick={() => remove(product.id_product)}>Delete</Button>
                        <Button className="buttonWithMargins" size="sm" color="primary" onClick={() => {
                            setModalNumberSold(true);
                            setSelectedId(product.id_product);
                        }}>
                            Number sold
                        </Button>
                    </ButtonGroup>
                </td>
            }
        </tr>
    });

    const categoryOptions = categories.map((category) => {
        return (
            <option key={category.category_number} value={category.category_number}>
                {category.category_name}
            </option>
        );
    });

    const handleCategoryChange = (event) => setSelectedCategory(event.target.value);
    const handleSearchProductNameChange = (event) => setSearchProductName(event.target.value);
    const handleStartDate = event => setStartDate(event.target.value);
    const handleEndDate = event => setEndDate(event.target.value);

    const toggleModalNumberSold = () => {
        setModalNumberSold(!modalNumberSold);
        if(modalNumberSold) {
            setNumberSold(null);
            setStartDate('');
            setEndDate('');
        }
    }

    const toggleModalSearchByName = () => setModalSearchByName(!modalSearchByName);

    const productsNum = async (productId, startDate, endDate) => {
        try {
            const response = await fetch(`/api/products-number?productId=${productId}&startDate=${startDate}&endDate=${endDate}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await response.json();
            setNumberSold(data);
        } catch (error) {
            console.log(error);
        }
    }

    const findProductsByName = async () => {
        try {
            const response = await fetch(`/api/products?name=${searchProductName}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.status === 204) {
                alert('There is no products with this name.');
            } else {
                const data = await response.json();
                setProductsFoundByName(data);
                toggleModalSearchByName();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const generatePDF = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: "Categories",
    });

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <div className="float-end">
                    { auth?.role === "MANAGER"
                        &&
                        <Button className="buttonWithMargins" color="success" tag={Link} to="/products/new">
                            Add Product
                        </Button>
                    }
                    { auth?.role === "MANAGER"
                        &&
                        <Button className="buttonWithMargins" onClick={generatePDF}>
                            Print
                        </Button>
                    }
                </div>

                <div ref={componentPDF}>
                    <h1>Products</h1>
                    <FormGroup className="noPrint">
                        <Input style={{width: '280px'}}
                               type="select"
                               name="category_number"
                               id="category_number"
                               onChange={handleCategoryChange}>
                            <option value="">Sort by name within Category</option>
                            <option value="allCategories">All categories</option>
                            {categoryOptions}
                        </Input>
                    </FormGroup>

                    { auth?.role === "CASHIER"
                        &&
                        <div className='search-container'>
                            <Input
                                style={{width: '200px' }}
                                type="text"
                                placeholder="Find by name"
                                value={searchProductName}
                                onChange={handleSearchProductNameChange}
                            />
                            <Button color="primary" onClick={() => findProductsByName()}>Search</Button>
                        </div>
                    }

                    {showEmpty ?
                        <div className="text-center">
                            <p>No results found.</p>
                        </div>
                        :
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="20%">Name</th>
                            <th width="20%">Category</th>
                            <th width="40%">Characteristics</th>
                            { auth?.role === "MANAGER" && <th width="20%">Actions</th> }
                        </tr>
                        </thead>
                        <tbody>
                        {productList}
                        </tbody>
                    </Table>
                    }
                </div>

                <Modal isOpen={modalNumberSold} toggle={toggleModalNumberSold}>
                    <ModalHeader toggle={toggleModalNumberSold}>Number sold</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="startDate">Start date and time: </Label>
                            <Input
                                style={{ display: 'inline-block', width: '200px'}}
                                type="datetime-local"
                                name="startDate"
                                id="startDate"
                                value={startDate}
                                required
                                onChange={handleStartDate}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="endDate">End date and time: </Label>
                            <Input
                                style={{ display: 'inline-block', width: '200px'}}
                                type="datetime-local"
                                name="endDate"
                                id="endDate"
                                value={endDate}
                                required
                                onChange={handleEndDate}
                            />
                        </FormGroup>

                        <Button color="secondary" onClick={() => productsNum(selectedId, startDate, endDate)}>Find</Button>
                        <p style={{margin: '10px'}}>
                            {numberSold === null ?
                                '' :
                                `Number of products sold in this time range: ${numberSold}`
                            }
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleModalNumberSold}>Close</Button>
                    </ModalFooter>
                </Modal>

                <SearchByNameModal
                    isOpen={modalSearchByName}
                    toggle={toggleModalSearchByName}
                    products={productsFoundByName}
                />

            </Container>
        </div>
    );
};

export default ProductList;