<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <i class="el-icon-search" style="margin-right: 10px"></i>
        <span>搜索信息</span>
      </div>
      <div style="display: flex; flex-wrap: wrap; justify-content: flex-start">
        <el-input
          class="search-input"
          placeholder="歌曲名字"
          v-model="searchText.title"
        ></el-input>
        <el-input
          class="search-input"
          placeholder="歌手"
          v-model="searchText.artist"
        ></el-input>

        <el-select
          class="search-input"
          v-model="searchText.language"
          placeholder="请选择语言"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <el-input
          class="search-input"
          placeholder="歌曲描述"
          v-model="searchText.description"
        ></el-input>

        <el-date-picker
          style="margin-bottom: 20px; margin-right: 20px"
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>

      <div>
        <el-button
          @click="searchButton"
          round
          type="primary"
          style="margin-right: 20px"
        >
          <i class="el-icon-search"></i>
          <span>点击搜索</span>
        </el-button>
        <el-button round @click="resetSearchTextButton">
          <i class="el-icon-search"></i>
          <span>重置条件</span>
        </el-button>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <div slot="header">
        <i class="el-icon-info" style="margin-right: 10px"></i>
        <span>音乐信息</span>
      </div>

      <div style="margin-bottom: 20px">
        <el-button round @click="addButton">
          <i class="el-icon-add" style="margin-right: 10px"></i>
          <span>添加音乐</span>
        </el-button>
        <el-button round @click="deleteSelectsButton">
          <i class="el-icon-add" style="margin-right: 10px"></i>
          <span>批量删除</span>
        </el-button>
      </div>

      <el-table
        @selection-change="changeSelect"
        v-loading="listLoading"
        :data="tableData"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          type="index"
          :index="nIndex"
          label="序号"
          width="60px"
        ></el-table-column>
        <el-table-column
          v-for="(item, index) in tableTitle"
          :key="item"
          :prop="tableProp[index + 1]"
          :label="item"
        ></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="data">
            <el-button
              icon="el-icon-edit"
              class="table-button"
              @click="editButton(data.row)"
            ></el-button>
            <el-button
              icon="el-icon-delete"
              class="table-button"
              @click="deleteRowButton(data.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        :total="total"
        :current-page="pagination.pageNum"
        :page-size="pagination.pageSize"
        @current-change="changePage"
      ></el-pagination>
    </el-card>

    <el-dialog :visible.sync="rowInfoDialogVisible">
      <div slot="title">
        <i class="el-icon-info" style="margin-right: 10px"></i>
        <span>音乐信息</span>
      </div>

      <el-form
        :model="rowInfoData"
        status-icon
        :rules="rules"
        ref="rowInfoData"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="歌曲名称" prop="title">
          <el-input v-model="rowInfoData.title"></el-input>
        </el-form-item>
        <el-form-item label="歌手" prop="artist">
          <el-input v-model="rowInfoData.artist"></el-input>
        </el-form-item>
        <el-form-item label="语言" prop="language">
          <el-select v-model="rowInfoData.language" placeholder="请选择语言">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="rowInfoData.description"></el-input>
        </el-form-item>
        <el-form-item label="发布时间" prop="releaseTime">
          <el-date-picker
            style="margin-bottom: 20px; margin-right: 20px"
            v-model="rowInfoData.releaseTime"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="primary" @click="submitRowInfoSubmie()"
          >提交</el-button
        >
        <el-button @click="toggleRowInfoDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deleteList, getList, postList, putList } from "@/api/table";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      listLoading: true,
      //表格数据
      tableData: null,
      tableProp: [],
      tableTitle: ["歌名", "歌手", "语言", "描述", "发行时间"],
      //分页数据
      pagination: {
        pageNum: 1,
        pageSize: 5,
      },
      total: 0,
      //搜索数据
      searchText: {},
      date: ["", ""],
      isEdit: false,
      options: [
        { value: "国语", label: "国语" },
        { value: "日语", label: "日语" },
        { value: "英语", label: "英语" },
      ],
      rowInfoData: {
        artist: "",
        id: "",
        releaseTime: "",
        language: "",
        description: "",
      },
      rules: {
        title: [{ required: true, message: "请输入", trigger: "blur" }],
        artist: [{ required: true, message: "请输入", trigger: "blur" }],
        releaseTime: [{ required: true, message: "请输入", trigger: "blur" }],
        language: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      //对话框show判断
      rowInfoDialogVisible: false,
      //删除
      rowId: [],
      selectIds: [],
    };
  },
  methods: {
    //获取表格数据
    fetchData() {
      this.listLoading = true;
      const searchDate = {
        startTime: this.date[0],
        endTime: this.date[1],
      };
      const params = Object.assign(
        this.pagination,
        this.searchText,
        searchDate
      );
      getList(params)
        .then((response) => {
          this.total = response.tableCount;
          this.tableData = response.data;
          if (this.tableData.length !== 0) {
            this.tableProp = Object.keys(this.tableData[0]);
          } else if (this.pagination.pageNum > 1) {
            this.pagination.pageNum--;
            this.fetchData();
          }
          this.listLoading = false;
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },

    //按钮事件
    searchButton() {
      this.pagination.pageNum = 1;
      this.fetchData();
    },
    resetSearchTextButton() {
      this.date = ["", ""];
      this.pagination.pageNum = 1;
      (this.searchText = {
        title: "",
        artist: "",
        releaseTime: "",
        language: "",
        description: "",
      }),
        this.fetchData();
    },
    addButton() {
      this.isEdit = false;
      this.rowInfoData = {
        artist: "",
        id: "",
        releaseTime: "",
        language: "",
        description: "",
      };
      this.toggleRowInfoDialog();
    },
    deleteSelectsButton() {
      this.$confirm("你确定要删除当前选中全部吗？", "提示", {
        submitButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          deleteList(this.selectIds).then((response) => {
            this.fetchData();
          });
        })
        .catch(() => {});
    },
    editButton(row) {
      this.isEdit = true;
      this.rowInfoData = { ...row };
      this.toggleRowInfoDialog();
    },
    deleteRowButton(row) {
      this.$confirm("你确定要删除当前行吗？", "提示", {
        submitButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.rowId[0] = row.id;
          deleteList(this.rowId)
            .then((response) => {
              this.fetchData();
            })
            .catch((err) => {});
        })
        .catch(() => {});
    },

    submitRowInfoSubmie() {
      if (this.isEdit) {
        putList(this.rowInfoData).then((response) => {
          console.log(response);
          this.fetchData();
          this.$message({
            type: response.type,
            message: response.msg,
          });
          this.toggleRowInfoDialog();
        });
      } else {
        postList(this.rowInfoData).then((response) => {
          console.log(response);
          this.fetchData();
          this.$message({
            type: response.type,
            message: response.msg,
          });
          this.toggleRowInfoDialog();
        });
      }
    },
    //切换对话框
    toggleRowInfoDialog() {
      this.rowInfoDialogVisible = !this.rowInfoDialogVisible;
    },
    //elementui需要的函数
    nIndex(index) {
      return (
        index + 1 + (this.pagination.pageNum - 1) * this.pagination.pageSize
      );
    },
    changePage(page) {
      this.pagination.pageNum = page;
      this.fetchData();
    },
    changeSelect(selects) {
      const ids = [];
      for (let i = 0; i < selects.length; i++) {
        ids.push(selects[i].id);
      }
      this.selectIds = ids;
      console.log(this.selectIds);
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style lang="scss" scoped>
.search-input {
  width: 200px;
  margin-right: 20px;
  margin-bottom: 20px;
}
.table-button {
  padding: 0;
  height: 30px;
  width: 30px;
  border-radius: 50%;
}
</style>
