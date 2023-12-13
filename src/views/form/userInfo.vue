<template>
  <div class="app-container" style="display: flex; justify-content: center">
    <el-card
      style="
        justify-content: center;
        display: flex;
        align-items: center;
        width: 700px;
      "
    >
      <el-form ref="form" label-width="120px">
        <el-form-item label="头像" class="form-item">
          <div
            style="
              width: 50px;
              height: 50px;
              border: 1px solid rgb(230, 230, 230);
              margin-bottom: 10px;
            "
          >
            <el-upload
              style="width: 50px; height: 50px"
              class="avatar-uploader"
              action="http://localhost:8080/api/user/uploadUserAvatar"
              :data="{ email: email }"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item
          label="用户名:"
          @click.native="usernameDialog"
          class="form-item"
        >
          <span>{{ name }}</span>
        </el-form-item>

        <el-form-item
          class="form-item"
          label="密码:"
          @click.native="passwordDialog"
        >
          <div style="display: flex">
            <span v-if="showPassword">{{ password }}</span>
            <span v-else> ******* </span>
            <div @click="toggleShowPassword" style="margin-left: 20px">
              <i v-if="showPassword" class="el-icon-view"></i>
              <i v-else class="el-icon-error"></i>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog :visible.sync="dialogVisible" :title="`修改${dialogTitle}`">
      <div style="display: flex; justify-content: center; align-items: center">
        <span style="width: 80px">{{ dialogTitle }}</span>
        <el-input v-model="text"></el-input>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="dialogSubmit">保存</el-button>
        <el-button @click="toggleDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateUserInfo } from "@/api/user";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      showPassword: false,
      text: "",
      imageUrl: "",
      dialogTitle: "",
      dialogVisible: false,
      paramsHash: {
        用户名: "username",
        密码: "password",
      },
    };
  },
  computed: {
    ...mapGetters(["name", "email", "password"]),
  },
  methods: {
    usernameDialog() {
      this.dialogTitle = "用户名";
      this.text = this.name;
      this.toggleDialog();
    },
    passwordDialog() {
      this.dialogTitle = "密码";
      this.text = this.password;
      this.toggleDialog();
    },

    dialogSubmit() {
      const data = {
        email: this.email,
      };
      data[this.paramsHash[this.dialogTitle]] = this.text;

      const body = Object.assign(data);
      updateUserInfo(body)
        .then((res) => {
          this.$store.dispatch("user/getInfo", this.email);
          if (this.dialogTitle === "密码") {
            this.$store.commit("user/SET_PASSWORD", this.text);
          }
          this.$message({
            type: res.type,
            message: res.msg,
          });
          this.toggleDialog();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            type: err.type,
            message: err.msg,
          });
        });
    },

    toggleDialog() {
      this.dialogVisible = !this.dialogVisible;
      if (this.dialogTitle === "密码") {
        this.$store.commit("user/SET_PASSWORD", this.text);
      }
    },
    toggleShowPassword() {
      event.stopPropagation();
      this.showPassword = !this.showPassword;
    },

    handleAvatarSuccess(res, file) {
      this.$store.dispatch("user/getInfo", this.email);
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
  created() {
    this.$store.commit("user/SET_PASSWORD", this.password);
  },
};
</script>

<style scoped>
.form-item {
  border-bottom: 1px solid rgb(230, 230, 230);
  cursor: pointer;
}
.line {
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.avatar {
  width: 50px;
  height: 50px;
  display: block;
}
</style>

