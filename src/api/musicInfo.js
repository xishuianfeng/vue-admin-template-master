import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/music/getMusicInfoList',
    method: 'get',
    params
  })
}
export function postList(data) {
  return request({
    url: '/music/insertMusicInfo',
    method: 'post',
    data
  })
}
export function putList(data) {
  return request({
    url: '/music/updateMusicInfo',
    method: 'put',
    data
  })
}
export function deleteList(data) {
  return request({
    url: '/music/deleteMusicInfoByIds',
    method: 'delete',
    data
  })
}

