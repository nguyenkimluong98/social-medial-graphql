import React, { useContext, useState } from "react";
import gql from "graphql-tag";
import { useLazyQuery } from "@apollo/client";

import { AuthContext } from "../contexts/auth";

import { Button, Form } from "semantic-ui-react";

const Login = (props) => {
	const [values, setValues] = useState({
		username: "",
		password: "",
	});

	const [errors, setErrors] = useState({
		username: false,
		password: false,
		graphqlError: {},
	});

	const context = useContext(AuthContext);

	const [login, { loading, data }] = useLazyQuery(LOGIN, {
		onCompleted: () => {
			context.login(data.login);
			props.history.push("/");
		},
		onError: (err) => {
			setErrors({
				...errors,
				graphqlError:
					err.graphQLErrors.length && err.graphQLErrors[0].extensions.errors,
			});
		},
		fetchPolicy: "network-only",
	});

	const onChange = (e) => {
		const targetName = e.target.name;

		setErrors({ ...errors, [targetName]: false });
		setValues({ ...values, [targetName]: e.target.value });
	};

	const validateForm = () => {
		let isError = false;
		const errorFields = { ...errors };

		Object.keys(values).forEach((key) => {
			if (!values[key]) {
				errorFields[key] = true;
				isError = true;
			}
		});

		return [isError, errorFields];
	};

	const onSubmit = (e) => {
		e.preventDefault();

		const [isError, errorFields] = validateForm();

		if (isError) {
			setErrors(errorFields);
			return;
		}

		setErrors({
			username: false,
			password: false,
			graphqlError: {},
		});

		login({ variables: values });
	};

	return (
		<div className="form-container">
			<Form className={loading ? "loading" : ""} onSubmit={onSubmit} noValidate>
				<h1 className="page-title">Login</h1>
				<Form.Input
					label="Username"
					type="text"
					placeholder="Enter your username"
					name="username"
					value={values.username}
					onChange={onChange}
					error={
						errors.username && {
							content: "Please enter your username",
							pointing: "below",
						}
					}
					required
				/>
				<Form.Input
					label="Password"
					type="password"
					placeholder="Enter your password"
					name="password"
					value={values.password}
					onChange={onChange}
					required
					error={
						errors.password && {
							content: "Please enter your password",
							pointing: "below",
						}
					}
				/>
				<Button type="submit" primary fluid>
					Login
				</Button>
			</Form>

			{Object.keys(errors.graphqlError).length > 0 && (
				<div className="ui error message">
					<ul className="list">
						{Object.values(errors.graphqlError).map((value) => (
							<li key={value}>{value}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

const LOGIN = gql`
	query Login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			username
			email
			token
			createdAt
		}
	}
`;

export default Login;
