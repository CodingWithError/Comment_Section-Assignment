import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addComment, editComment, deleteComment, addReply } from '../store/commentSlice';

const CommentSection = () => {
  const [name, setName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyName, setReplyName] = useState('');
  const [replyText, setReplyText] = useState('');

  const comments = useSelector(state => state.comments);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !commentText.trim()) {
      alert('Please enter both name and comment');
      return;
    }
    dispatch(addComment(name, commentText));
    setName('');
    setCommentText('');
  };

  const handleEdit = (id, text) => {
    setEditingId(id);
    setCommentText(text);
  };

  const handleSaveEdit = (id) => {
    dispatch(editComment({ id, text: commentText }));
    setEditingId(null);
    setCommentText('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      dispatch(deleteComment(id));
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    setReplyName('');
    setReplyText('');
  };

  const handleSaveReply = (commentId) => {
    if (!replyName.trim() || !replyText.trim()) {
      alert('Please enter both name and reply');
      return;
    }
    dispatch(addReply(commentId, replyName, replyText));
    setReplyingTo(null);
    setReplyName('');
    setReplyText('');
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Comment</h2>
        <div className="text-sm">Sort By: Date and Time ↓</div>
      </div>
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          placeholder="Comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded float-right">
          POST
        </button>
      </form>
      <div>
        {comments.sort((a, b) => new Date(b.date) - new Date(a.date)).map(comment => (
          <div key={comment.id} className="bg-white p-4 mb-4 rounded shadow relative">
            <button
              onClick={() => handleDelete(comment.id)}
              className="absolute top-0 right-0 bg-gray-200 text-gray-600 px-2 py-1 rounded-bl"
            >
              ⋮
            </button>
            <h3 className="font-bold">{comment.name}</h3>
            {editingId === comment.id ? (
              <>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                />
                <button onClick={() => handleSaveEdit(comment.id)} className="text-blue-500 mr-2">
                  Save
                </button>
                <button onClick={() => setEditingId(null)} className="text-gray-500">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p>{comment.text}</p>
                <div className="mt-2">
                  <button onClick={() => handleReply(comment.id)} className="text-blue-500 mr-2">
                    Reply
                  </button>
                  <button onClick={() => handleEdit(comment.id, comment.text)} className="text-blue-500">
                    Edit
                  </button>
                </div>
              </>
            )}
            <span className="text-sm text-gray-500 block mt-2">
              {new Date(comment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            {replyingTo === comment.id && (
              <div className="mt-4 bg-gray-50 p-4 rounded">
                <input
                  type="text"
                  placeholder="Name"
                  value={replyName}
                  onChange={(e) => setReplyName(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                />
                <textarea
                  placeholder="Reply"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                />
                <button onClick={() => handleSaveReply(comment.id)} className="bg-blue-500 text-white px-4 py-2 rounded float-right">
                  POST
                </button>
                <div className="clear-both"></div>
              </div>
            )}
            {comment.replies.map(reply => (
              <div key={reply.id} className="bg-gray-50 p-4 mt-2 rounded">
                <h4 className="font-bold">{reply.name}</h4>
                <p>{reply.text}</p>
                <span className="text-sm text-gray-500 block mt-2">
                  {new Date(reply.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
                <button className="text-blue-500 mt-2">Edit</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;