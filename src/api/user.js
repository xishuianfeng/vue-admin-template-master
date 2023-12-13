import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data: data
  })
}

export function getInfo(email) {
  return request({
    url: '/user/getUserInfoByEmail',
    method: 'post',
    params: {
      email
    }
  })
}

export function updateUserInfo(data) {
  return request({
    url: '/user/updateUserInfoByEmail',
    method: 'put',
    data
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
