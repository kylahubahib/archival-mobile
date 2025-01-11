import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import { getToken } from '../services/TokenService';
import axios from '../../utils/axios';
import { loadUser } from '../services/AuthService';
import { url } from '../../utils/utils';

export default function ManuscriptComments({ manuscriptId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchComments();
  }, [manuscriptId]);

  const fetchUser = async () => {
    const response = await loadUser();
    setUser(response);
  };

  const fetchComments = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`/fetch-comments/${manuscriptId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error.message || error);
      setError('Failed to fetch comments');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const token = await getToken();
      const response = await axios.post(
        '/comments',
        {
          manuscript_id: manuscriptId,
          content: newComment,
          parent_id: replyingTo ? replyingTo.id : null, // Parent ID for replies
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        fetchComments();
        setNewComment('');
        setReplyingTo(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment.');
    } finally {
      setSubmitting(false);
    }
  };

  // Recursive component to render comments and replies
  const Comment = ({ comment }) => (
    <View style={styles.comment}>
      <Avatar.Image
        size={32}
        source={{
          uri: comment.user?.user_pic
            ? `${url.BASE_URL}/${comment.user.user_pic}`
            : 'https://ui-avatars.com/api/?name=Anonymous&background=random',
        }}
      />
      <View style={styles.commentContent}>
        <Text style={styles.commentAuthor}>{comment.user?.name || 'Anonymous'}</Text>
        <Text style={styles.commentText}>{comment.content}</Text>
        <Button
          onPress={() => setReplyingTo(comment)}
          mode="text"
          compact
          textColor="#007BFF"
        >
          Reply
        </Button>

        {/* Render replies recursively */}
        {comment.replies && comment.replies.length > 0 && (
          <View style={styles.replies}>
            {comment.replies.map((reply) => (
              <Comment key={reply.id} comment={reply} />
            ))}
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading comments...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>Comments:</Text>

          {/* Add or Reply to Comment */}
          <View style={styles.addCommentContainer}>
            {replyingTo && (
              <Text style={styles.replyingToText}>
                Replying to: {replyingTo.user?.name || 'Anonymous'}
              </Text>
            )}
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity
              style={[styles.submitButton, submitting ? { backgroundColor: '#ccc' } : {}]}
              onPress={handleAddComment}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>{submitting ? 'Posting...' : 'Post'}</Text>
            </TouchableOpacity>
            {replyingTo && (
              <Button
                onPress={() => setReplyingTo(null)}
                mode="text"
                compact
                textColor="#FF0000"
              >
                Cancel Reply
              </Button>
            )}
          </View>

          {/* Render Comments */}
          <View style={{ marginTop: 20 }}>
            {comments.length > 0 ? (
              comments.map((comment) => <Comment key={comment.id} comment={comment} />)
            ) : (
              <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  commentsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#294996',
    marginBottom: 8,
  },
  addCommentContainer: {
    marginBottom: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#294996',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  replyingToText: {
    fontSize: 14,
    color: '#007BFF',
    marginBottom: 8,
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  commentContent: {
    marginLeft: 8,
    flex: 1,
  },
  commentAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  replies: {
    marginTop: 8,
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#ccc',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  noCommentsText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 16,
  },
});
