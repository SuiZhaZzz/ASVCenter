<template>
  <q-layout view="hHh LpR fFf">
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm ? { 'width': '80%' } : { 'width': '30%' }">
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="/whu-icon.png">
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                登录
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input filled v-model="username" label="用户名" lazy-rules />

              <q-input type="password" filled v-model="password" label="密码" lazy-rules />

              <div>
                <!-- <q-btn label="Login" to="/" type="button" color="primary" /> -->
                <q-btn label="登录" type="button" color="primary" @click="login" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import { ref } from 'vue'
import { Cookies, useQuasar } from 'quasar'
import axios from 'axios'
export default defineComponent({
  name: "LoginPage",
  setup() {
    return {
      username: ref('admin'),
      password: ref('admin'),
      $q: useQuasar(),
    }
  },
  methods: {
    login() {
      const self = this;
      const username = self.username;
      const password = self.password;
      console.log(username, password);
      // check if username and password are empty
      if (username === '' || password === '') {
        self.$q.notify({
          position: 'top',
          message: '用户名或密码不能为空。'
        });
        return;
      }
      else {
        self.$q.notify({
          position: 'top',
          message: '登录中...'
        });
        // axios.post('http://127.0.0.1:8502/user/login', {
        axios.get('http://1.116.246.209:8502/user/login', {
          params: {
            username: username,
            password: password,
          }
        }).then(
          res => {
            console.log(res);
            if (res.data.result == 200) {
              self.$q.notify({
                position: 'top',
                message: '登陆成功！'
              });
              self.$q.cookies.set('username', username, { expires: '3600s' })
              self.$q.cookies.set('is_login', username, { expires: '3600s' })
              this.$router.push('/')
            }
            self.$q.notify({
              position: 'top',
              message: res.data.msg
            });
          }).catch(
            err => {
              self.$q.notify({
                position: 'top',
                message: err.message
              });
            })
      }
    }
  }
})
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>
