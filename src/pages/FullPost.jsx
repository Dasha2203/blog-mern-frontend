import React, {useEffect, useState} from "react";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import {useParams} from "react-router-dom";
import axios from "../axios";
import ReactMarkdown from "react-markdown";

export const FullPost = () => {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPost = async (id) => {
    try {
      setIsLoading(true)
      let res = await axios.get(`/posts/${id}`);
      setPost(res.data);
    } catch(err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPost(id)
  }, [id]);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost/>
  }

  return (
    <>
      <Post
        id={post._id}
        title={post.title}
        imageUrl={post.imageUrl ? `${process.env.REACT_APP_API_URL}${post.imageUrl}` : ''}
        user={post.user}
        createdAt={post.createdAt}
        viewsCount={post.viewsCount}
        commentsCount={3}
        tags={post.tags}
        isFullPost
      >
        <ReactMarkdown children={post.text}/>
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
          },
          {
            user: {
              fullName: "Иван Иванов",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
