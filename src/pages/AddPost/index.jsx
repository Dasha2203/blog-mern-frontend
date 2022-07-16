import React, { useState, useRef, useEffect } from 'react';
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import SimpleMDE from 'react-simplemde-editor';

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

import {selectIsAuth} from "../../redux/slices/auth";
import axios from "../../axios";

export const AddPost = () => {
  const {id} = useParams()
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const inputFileRef = useRef(null);
  const [imageUrl, setImageUrl] = useState('');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);

      setImageUrl(data.url);
    } catch(err) {
      console.log(err);
      alert('Error load files');
    }
  };

  const onClickRemoveImage = async (event) => {
    setImageUrl('');
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const fields = {
        title,
        imageUrl,
        tags,
        text
      }
      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch(err) {
      console.log(err);
      alert('error create post')
    }
  }

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTags(data.tags.join(','));
        })
        .catch((err) => {
          console.warn(err);
          alert('Ошибка при получении статьи!');
        });
    }
  }, []);


  if (!localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/"/>
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input type="file" ref={inputFileRef} onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Delete
          </Button>
          <img className={styles.image} src={`${process.env.REACT_APP_API_URL}${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Post title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Tags"
        fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Save' : 'Publicate'}
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};
