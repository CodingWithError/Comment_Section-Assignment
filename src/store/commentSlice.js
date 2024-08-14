import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const loadComments = () => {
  const saved = localStorage.getItem('comments');
  return saved ? JSON.parse(saved) : [];
};

const saveComments = (comments) => {
  localStorage.setItem('comments', JSON.stringify(comments));
};

const commentSlice = createSlice({
  name: 'comments',
  initialState: loadComments(),
  reducers: {
    addComment: {
      reducer(state, action) {
        state.push(action.payload);
        saveComments(state);
      },
      prepare(name, text) {
        return {
          payload: {
            id: uuidv4(),
            name,
            text,
            date: new Date().toISOString(),
            replies: []
          }
        };
      }
    },
    editComment(state, action) {
      const { id, text } = action.payload;
      const comment = state.find(comment => comment.id === id);
      if (comment) {
        comment.text = text;
        saveComments(state);
      }
    },
    deleteComment(state, action) {
      const index = state.findIndex(comment => comment.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
        saveComments(state);
      }
    },
    addReply: {
      reducer(state, action) {
        const { commentId, reply } = action.payload;
        const comment = state.find(comment => comment.id === commentId);
        if (comment) {
          comment.replies.push(reply);
          saveComments(state);
        }
      },
      prepare(commentId, name, text) {
        return {
          payload: {
            commentId,
            reply: {
              id: uuidv4(),
              name,
              text,
              date: new Date().toISOString()
            }
          }
        };
      }
    }
  }
});

export const { addComment, editComment, deleteComment, addReply } = commentSlice.actions;
export default commentSlice.reducer;