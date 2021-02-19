<template>

<div class="container">
  <div class="header">
    <h1>Bonjour {{ user.username }} !</h1>
    <div @click="wantToPost = !wantToPost" class="addPostBtn">
      <img :src="cancelIcon"><span>Ajouter un post</span>
    </div>
  </div>
  <div v-if="wantToPost" class="formContainer">
    <h2>Créer un post</h2>
    <img @click="wantToPost = !wantToPost" :src="cancelIcon" />
    <form @submit.prevent="createPost">
      <div v-if="isValidForm.message" class="error alert">
        <p>{{ isValidForm.message }}</p>
      </div>
      <div class="inputGroup">
        <label for="contentInput">Contenu: </label>
        <textarea type="text" id="content" name="content" v-model="post.content" placeholder="Que voulez vous leur dire ?"></textarea>
      </div>  
      <input :disabled="isValidForm.message" type="submit" value="Poster" />
    </form>  
  </div>
  <div v-if="postsListFormed.length" class="postsList">
    <div v-for="(post, index) in postsListFormed" :key="'post_'+index" class="post">
      <div class="headerPost">
        <span>{{ post.user.username }}</span>
      </div>
      <div class="contentPost">
        <p> {{ post.content }}</p>
      </div>
      <div v-if="post.likes" class="footerPost">
          <div class="headerLike">
            <div class="countLike">{{ post.likes.length }}</div>
            <img @click="likePost(post._id)" v-if="hasLike(post._id)" :src="heartFullIcon" />
            <img @click="likePost(post._id)" v-else :src="heartIcon" />
          </div>
          <div v-if="post.likes.length" class="containLikes">
            <span>Like par:</span>
            <span v-for="(like, indexLike) in post.likes" :key="'like_' + indexLike">
              {{ indexLike === post.likes.length - 1 ? like.username : like.username + ', ' }}
            </span>
          </div>
      </div>
    </div>
  </div>
</div>

</template>


<script>
import { list as listHTTP, create as createHTTP, like as likeHTTP } from 'Services/post.js';
import cancelIcon from 'Images/cancel.png';
import heartIcon from 'Images/heart.png';
import heartFullIcon from 'Images/heart-full.png';

export default {
  data: function () {
    return {
      wantToPost: false,
      post: {
        content: '',
      },
      user: {},
      postsList: [],
      cancelIcon,
      heartIcon,
      heartFullIcon
    }
  },

  async mounted () {
    try {
      const { data: { result, user } } = await listHTTP();
      this.postsList = result;
      this.user = user;
      const self = this;
      this.sockets.subscribe('postLike', (data) => {
        const { idPost, user } = data;
        self.likePostLocal(idPost, user);
      });
      this.sockets.subscribe('postDisLike', (data) => {
        const { idPost, user } = data;
        self.disLikePostLocal(idPost, user);
      });
      this.sockets.subscribe('postCreate', (data) => {
        self.createPost('', data);
      });

    } catch (e) {
      console.log(e);
    }
  },

  computed: {
    isValidForm () {
      const { content } = this.post;
      if (!content.length)
        return { message: 'Formulaire invalide'};
      
      return true;
    },

    postsListFormed () {
      if (!this.postsList) return [];
      return this.postsList.reverse();
    }
  },

  methods: {
    async createPost (e, postLocal) {
      try {
        let local = {};
        if (!postLocal) {
          
          const { post, user } = this;
          post.user = user;
          const { data: result} = await createHTTP(post);
          local = result.result;
        } else {
          local = postLocal;
        }
        this.postsList.push(local);
      } catch (e) {
        console.log(e);
      }
    },

    hasLike(idPost) {
      const post = this.postsList.find(post => post._id == idPost);
      if (!post) return ;
      const hasLike = post.likes.findIndex(like => like._id == this.user._id);
      if (hasLike != -1) return true;
      else return false;
    },

    async likePost(idPost) {
        const post = this.postsList.find(post => post._id == idPost);
        if (!post) return ;
        
        const hasLikeIndex = post.likes.findIndex(like => like._id == this.user._id);
        if (hasLikeIndex !== -1) {
          post.likes.splice(hasLikeIndex, 1);
        } else {
          post.likes.push(this.user);
        }
        await likeHTTP(idPost, { idUser: this.user._id });
    },
    
    likePostLocal(idPost, user) {
      const post = this.postsList.find(post => post._id == idPost);
        if (!post) return ;
        
        const hasLikeIndex = post.likes.findIndex(like => like._id == user._id);
        if (hasLikeIndex === -1) {
          post.likes.push(user);
        }
    },
    disLikePostLocal(idPost, user) {
      const post = this.postsList.find(post => post._id == idPost);
        if (!post) return ;
        
        const hasLikeIndex = post.likes.findIndex(like => like._id == user._id);
        if (hasLikeIndex !== -1) {
          post.likes.splice(hasLikeIndex, 1);
        }
    },
  }
}

</script>


<style lang="scss" scoped>
.container {
    width: 70%;
    margin: auto;
}

.header {
  display: flex;
  align-items: center;
  .addPostBtn {
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #20325C;
    background: #20325C;
    color: white;
    transition: 350ms ease-in;
    margin-left: 25px;
    cursor: pointer;
    font-weight: bold;
    display: flex;
    align-items: center;

    &:hover {
      background: transparent;
      color: #20325C;
    }

    img {
      width: 20px;
      transform: rotate(45deg);
      margin-right: 10px;
      transition: 350ms ease-in;
      background: #20325C;
      padding: 3px;
    }
  }
}

.formContainer {
  width: 50%;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  padding: 15px;
  position: relative;

  img {
    width: 26px;
    transition: 350ms ease-in;
    background: #20325C;
    padding: 3px;
    position: absolute;
    top: 15px;
    right: 50px;
    cursor: pointer;
    }

  h2 {
    text-align: center;
    margin: 0;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    .alert {
      width: 50%;
      margin: 15px auto 0 auto;
    }
    .inputGroup {
      width: 50%;
      margin: 15px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: column;

      label {
        font-size: 1.1em;
        font-weight: bold;
        margin-right: 10px;
      }
      textarea {
        padding: 10px 15px;
        transition: 350ms ease-in;
        width: 100%;
        height: 100px;
        margin-top: 10px;

        &:focus {
          outline: #20325C auto 1px;
        }
      }
    }
    input[type="submit"] {
      appearance: none;
      border-radius: 4px;
      border: 1px solid #20325C;
      background: #20325C;
      color: white;
      cursor: pointer;
      padding: 15px;
      font-size: 1.2em;
      font: bold;
      transition: 350ms ease-in;
      margin-top: 25px;

      &:hover {
        background: transparent;
        color: #20325C;
      }

      &:disabled {
        background: darken(#20325C, 25%);
        color: darken(white, 50%);
      }
    }
  }
}


.error {
  background: darkred;
  color: white;
}

.alert {
  padding: 15px;
  border-radius: 4px;
  width: 100%;

  p {
    margin: 0;
  }
}

.postsList {
  margin-top: 75px;
  padding-top: 15px;
  padding-bottom: 15px;

  .post {
    border-radius: 4px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    margin-top: 20px;

    .headerPost {
      font-size: 1.3em;
      font-weight: bold;
      padding: 10px;
    }
    .contentPost {
      padding-left: 10px;
      padding-right: 10px;
    }
    .footerPost {
      background: #20325C;
      padding: 10px;
      .headerLike {
        display: flex;
        align-items: center;
        height: 100%;
        .countLike {
          padding: 7px;
          border-radius: 4px;
          background: white;
          color: #20325C;
          font-weight: bold;
          display: flex;
          align-items: center;
          font-size: 1.1em;
        }
        img {
          width: 32px;
          margin-left: 10px;
        }
      }

      .containLikes {
        margin-top: 15px;
        color: white;
      }
    }
  }
}

</style>