<template>

<div class="container">
  <div class="formContainer">
    <h1>Se connecter</h1>
    <form @submit.prevent="login">
      <div v-if="isValidForm.message" class="error alert">
        <p>{{ isValidForm.message }}</p>
      </div>
      <div class="inputGroup">
        <label for="emailInput">Email: </label>
        <input type="email" id="emailInput" name="emailInput" v-model="user.mail" placeholder="Saisissez votre email" />
      </div>  
      <div class="inputGroup">
        <label for="passwordInput">Password: </label>
        <input type="password" id="passwordInput" name="passwordInput" v-model="user.password" placeholder="Saisissez votre passord" />
      </div>
      <input :disabled="isValidForm.message" type="submit" value="Se connecter" />
    </form>  
  </div>
</div>

</template>


<script>
import { login as loginHTTP } from 'Services/user.js';
import firebase from 'firebase';

export default {
  data: function() {
    return {
      user: {
        mail: process.env.LOGIN_AUTHENTIFICATION,
        password: process.env.PASSWORD_AUTHENTIFICATION
      }
    }
  },

  computed: {

    isValidForm () {
      const { mail, password } = this.user;
      if (!mail.length || !password.length)
        return { message: 'Formulaire invalide'};
      
      return true;
    }
  },

  methods: {
    async login () {
      try {
        const { data: { result } } = await loginHTTP(this.user);
        const { user } = await firebase.auth().signInWithEmailAndPassword(this.user.mail, this.user.password);
        const token  = await firebase.auth().currentUser.getIdToken(true);
        window.localStorage.setItem('token', token);
        this.$router.push({ name: 'list' });
      } catch (e) {
        console.log(e);
      }
    }
  }
}

</script>


<style lang="scss" scoped>

.container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.formContainer {
  width: 50%;
  height: 70%;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

  h1 {
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    .alert {
      width: 50%;
      margin: 15px auto;
    }
    .inputGroup {
      width: 50%;
      margin: 15px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;

      label {
        font-size: 1.1em;
        font-weight: bold;
        margin-right: 10px;
      }
      input {
        padding: 10px 15px;
        transition: 350ms ease-in;

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

</style>