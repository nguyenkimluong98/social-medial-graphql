import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import { FETCH_POSTS_QUERY } from "../utils/graphql";

import { Button, Form, FormField, FormInput } from "semantic-ui-react";

export default function PostForm() {
	const [values, setValues] = useState({ body: "" });
	const [errors, setErrors] = useState({ body: false });

	const [createPost] = useMutation(CREATE_POST_MUTATION, {
		update(cache, result) {
			const data = cache.readQuery({
				query: FETCH_POSTS_QUERY,
			});

			const updatedData = {
				...data,
				getPosts: [result.data.createPost, ...data.getPosts],
			};

			cache.writeQuery({
				query: FETCH_POSTS_QUERY,
				data: updatedData,
			});

			values.body = "";
			errors.body = false;
		},
		variables: values,
	});

	const onChange = (e) => setValues({ body: e.target.value });

	const onSubmit = () => {
		if (!values.body) {
			setErrors({ body: true });
			return;
		}

		createPost();
	};

	return (
		<Form onSubmit={onSubmit}>
			<h2>Create a post:</h2>
			<FormField>
				<FormInput
					placeholder="Hi World!"
					label={false}
					onChange={onChange}
					value={values.body}
					error={errors.body}
				/>
				<Button type="submit" color="teal">
					Submit
				</Button>
			</FormField>
		</Form>
	);
}

const CREATE_POST_MUTATION = gql`
	mutation CreatePost($body: String!) {
		createPost(body: $body) {
			id
			username
			body
			createdAt
			likes {
				id
				username
				createdAt
			}
			likeCount
			comments {
				id
				body
				username
				createdAt
			}
			commentCount
		}
	}
`;
