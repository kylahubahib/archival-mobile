import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Button, Chip } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { getToken } from '../../services/TokenService';
import axios from '../../../utils/axios';
import { loadUser } from '../../services/AuthService';
import { url } from '../../../utils/utils';

export default function ViewPostDetail() {
  const { postId } = useLocalSearchParams();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getUser();
    getPostDetails();
  }, []);

  const getUser = async () => {
    const response = await loadUser();
    setUser(response);
  };

  const getPostDetails = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setPost(response.data);
      fetchComments();
    } catch (error) {
      console.error('Error fetching post details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      setSubmitting(true);
      const token = await getToken(); 
      console.log('Submitting comment...');
      const response = await axios.post('/forum-comments',
        {
          forum_post_id: post.id,
          comment: newComment,
          parent_id: replyingTo?.id || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
  
      const newCommentData = response.data;
  
      // Function to add a reply to the correct comment recursively
      const addReplyToComments = (comments, parentId, reply) => {
        return comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), reply],
            };
          }
  
          if (comment.replies) {
            return {
              ...comment,
              replies: addReplyToComments(comment.replies, parentId, reply),
            };
          }
  
          return comment;
        });
      };
  
      // If replying to a specific comment or reply
      if (replyingTo) {
        setComments((prev) => addReplyToComments(prev, replyingTo.id, newCommentData));
      } else {
        // If it's a new top-level comment
        setComments((prev) => [...prev, newCommentData]);
      }
  
      setNewComment('');
      setReplyingTo(null);
      setSubmitting(false);
    } catch (error) {
      console.error('Error submitting comment:', error.response?.data || error.message);
    }
  };

  const fetchComments = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`/forum-comments/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
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
        <Text style={styles.commentText}>{comment.comment}</Text>
        <Button
          onPress={() => setReplyingTo(comment)}
          mode="text"
          compact
          textColor="#007BFF"
        >
          Reply
        </Button>

        {/* Render replies if they exist */}
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading post details...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Unable to load post details. Please try again later.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Avatar.Image
          size={48}
          source={{
            uri: post.user?.user_pic
              ? `${url.BASE_URL}/${post.user.user_pic}`
              : 'https://ui-avatars.com/api/?name=User&background=random',
          }}
        />
        <Text style={styles.userName}>{post.user?.name || 'User'}</Text>
      </View>

      <Text style={styles.postTitle}>{post.title}</Text>
      <Text style={styles.postBody}>{post.body}</Text>

      <View style={styles.tagsContainer}>
        {post.tags?.map((tag, index) => (
          <Chip key={`${tag.id || index}-${tag.name}`} style={styles.chip}>
            {tag.name}
          </Chip>
        ))}
      </View>

      <View style={styles.viewsContainer}>
        <FontAwesome name="eye" size={16} color="gray" />
        <Text style={styles.viewCount}>{post.viewCount || 0} Views</Text>
      </View>
      
    <TextInput
      value={newComment}
      onChangeText={setNewComment}
      style={styles.commentInput}
      placeholder={
        replyingTo
          ? `Replying to ${replyingTo.user?.name || 'User'}...`
          : 'Write your comment here...'
      }
    />

    <TouchableOpacity
        onPress={handleCommentSubmit}
        mode="contained"
        disabled={!newComment.trim()}
        buttonColor={!newComment.trim() ? 'gray' : '#007BFF'}
        style={styles.submitButton}
      >
         <Text style={styles.submitButtonText}>{submitting ? 'Posting...' : 'Post'}</Text>
      </TouchableOpacity>
      {replyingTo && (
        <Button onPress={() => setReplyingTo(null)} mode="text">
          Cancel Reply
        </Button>
      )}
      

    <Text style={styles.commentsHeader}>Comments</Text>
    {comments.length > 0 ? (
      comments.map((comment) => <Comment key={comment.id} comment={comment} />)
    ) : (
      <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
    )}
    </ScrollView>
  );

}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
    paddingBottom: 100
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#007BFF',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  postTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postBody: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewCount: {
    marginLeft: 4,
    fontSize: 16,
    color: 'gray',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  commentsHeader: {
  fontSize: 18,
  fontWeight: 'bold',
  marginVertical: 16,
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
noCommentsText: {
  fontSize: 16,
  color: 'gray',
  textAlign: 'center',
  marginTop: 16,
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
replies: {
  marginTop: 8,
  paddingLeft: 16,
  borderLeftWidth: 1,
  borderLeftColor: '#ccc',
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


});
