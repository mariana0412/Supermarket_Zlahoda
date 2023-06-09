import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import useLastPath from "../../hooks/useLastPath";

const EmployeeEdit = () => {
    const initialFormState = {
        id_employee: '',
        empl_surname: '',
        empl_name: '',
        empl_patronymic: '',
        empl_role: '',
        salary: '',
        date_of_birth: '',
        date_of_start: '',
        phone_number: '',
        city: '',
        street: '',
        zip_code: ''
    };
    const [employee, setEmployee] = useState(initialFormState);
    const navigate = useNavigate();
    const { id } = useParams();
    useLastPath();

    useEffect(() => {
        if (id !== 'new') {
            fetch(`/api/employees/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
            })
                .then(response => response.json())
                .then(data => setEmployee(data));
        }
    }, [id, setEmployee]);

    const handleChange = (event) => {
        const { name, value } = event.target

        setEmployee({ ...employee, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch(`/api/employees${employee.id_employee ? `/${employee.id_employee}` : ''}`, {
            method: (employee.id_employee) ? 'PUT' : 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employee)
        });

        if (response.ok) {
            setEmployee(initialFormState);
            navigate('/employees');
        } else if(response.status === 409){
            const message = await response.text();
            alert(message);
        } else {
            const message = await response.text();
            console.log(message)
        }
    }

    const title = <h2>{employee.id_employee ? 'Edit Employee' : 'Add Employee'}</h2>;

    return (<div>
        <AppNavbar/>
        <Container>
            {title}
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="empl_surname">Surname</Label>
                    <Input type="text" name="empl_surname" id="empl_surname" required value={employee.empl_surname || ''}
                           onChange={handleChange} autoComplete="empl_surname"/>
                </FormGroup>

                <FormGroup>
                    <Label for="empl_name">Name</Label>
                    <Input type="text" name="empl_name" id="empl_name" required value={employee.empl_name || ''}
                           onChange={handleChange} autoComplete="empl_name"/>
                </FormGroup>

                <FormGroup>
                    <Label for="empl_patronymic">Patronymic</Label>
                    <Input type="text" name="empl_patronymic" id="empl_patronymic" value={employee.empl_patronymic || ''}
                           onChange={handleChange} autoComplete="empl_patronymic"/>
                </FormGroup>

                <FormGroup>
                    <Label for="empl_role">Role</Label>
                    <Input
                        type="select"
                        name="empl_role"
                        id="empl_role"
                        required value={employee.empl_role || ''}
                        onChange={handleChange}
                        autoComplete="empl_role">
                        <option value="">Select Role</option>
                        <option value="Cashier">Cashier</option>
                        <option value="Manager">Manager</option>
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Label for="salary">Salary</Label>
                    <Input type="number" name="salary" id="salary"   required value={employee.salary || ''}
                           onChange={handleChange} autoComplete="salary"/>
                </FormGroup>

                <FormGroup>
                    <Label for="date_of_birth">Date of Birth</Label>
                    <Input type="date" name="date_of_birth" id="date_of_birth" required value={employee.date_of_birth || ''}
                           onChange={handleChange} autoComplete="date_of_birth"/>
                </FormGroup>

                <FormGroup>
                    <Label for="date_of_start">Date of Start</Label>
                    <Input type="date" name="date_of_start" id="date_of_start" required value={employee.date_of_start || ''} onChange={handleChange} autoComplete="date_of_start"/>
                </FormGroup>

                <FormGroup>
                    <Label for="phone_number">Phone Number</Label>
                    <Input type="tel" name="phone_number" id="phone_number" required value={employee.phone_number || ''} onChange={handleChange} autoComplete="phone_number"/>
                </FormGroup>

                <FormGroup>
                    <Label for="city">City</Label>
                    <Input type="text" name="city" id="city" required value={employee.city || ''} onChange={handleChange} autoComplete="city"/>
                </FormGroup>

                <FormGroup>
                    <Label for="street">Street</Label>
                    <Input type="text" name="street" id="street" required value={employee.street || ''} onChange={handleChange} autoComplete="street"/>
                </FormGroup>

                <FormGroup>
                    <Label for="zip_code">Zip Code</Label>
                    <Input type="text" name="zip_code" id="zip_code" required value={employee.zip_code || ''} onChange={handleChange} autoComplete="zip_code"/>
                </FormGroup>

                <FormGroup>
                    <Button color="primary" type="submit">Save</Button>{' '}
                    <Button color="secondary" tag={Link} to="/employees">Cancel</Button>
                </FormGroup>
            </Form>
        </Container>
    </div>
    )
};

export default EmployeeEdit;