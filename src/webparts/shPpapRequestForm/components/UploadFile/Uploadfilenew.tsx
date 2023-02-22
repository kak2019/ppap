import * as React from 'react';
import { ChangeEvent, useEffect, useState } from 'react';
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import { spfi, SPFx } from "@pnp/sp";
import { IFileAddResult, IFileInfo } from '@pnp/sp/files';
import { getSP } from "../../common/pnpjsConfig";
import { Button, Checkbox, Icon, Label, PrimaryButton } from 'office-ui-fabric-react';

import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import styles from "../ShPpapRequestForm.module.scss";
import IconSelected from './FileIcon/FileIconConponent';
import { IItemAddResult } from "@pnp/sp/items";
import { DisplayMode } from '@microsoft/sp-core-library';

// TODO: 新增的fluentUI
import { DetailsList, DetailsListLayoutMode, SelectionMode, IColumn } from '@fluentui/react/lib/DetailsList';
import { TooltipHost } from '@fluentui/react';



// 无状态组件
function FileUploadMultiple(props: any) {
  const { mainTitle, titleDiscription, mandatoryBool, checkboxTitle, uploadFilePath, fileUploadControlBool } = props
  // 这是个钩子
  //const [fileList, setFileList] = useState<FileList | any>(null);
  const [fileList, setFileList] = useState<IFileInfo | any>(null);
  const [itemFolder, setFolderList] = useState<IFileInfo | any>(null);
  const [jiraInputValue, setjiraInputValue] = useState<string>(null);
  const [checkboxState, setCheckboxState] = useState<string>(null)
  const [checkboxBool, setcheckboxBool] = useState<boolean>(null)
  // 控制 save jira 按钮显示
  const [saveJiraDisable, setsaveJiraDisable] = useState<boolean>(null)
 
  const _sp = getSP();
  const sp = spfi(_sp);
  useEffect(() => {
    getFileInfoFromSPDoc();
    setcheckboxBool(false);
    setsaveJiraDisable(true)
  }, [])


  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    //这步钩子是异步的
    setFileList(null);
    setFileList(e.target.files);
    return console.log(fileList)
    //console.log(fileList)
  };

  const onclick_checkboxValue = () => {

    console.log(checkboxBool)
    if (checkboxBool) {
      setCheckboxState("block")
    } else {
      setCheckboxState("none")
    }
    setcheckboxBool(!checkboxBool)
  }

  //监听 jira输入框的值
  const onchange_inputValue = (e: any) => {
    setjiraInputValue(e.target.value);
    setsaveJiraDisable(false);
  }

  // 保存jira代码到SP
  const saveInputText = async () => {

    const iar: IItemAddResult = await sp.web.lists.getByTitle("Temp GPS Orders").items.add({
      Title: "Title",
      JireNumber: jiraInputValue
    });

    console.log(iar);
    alert("save :" + jiraInputValue);
    setsaveJiraDisable(true)

  }

  // 加载 上传文件夹的数据
  const getFileInfoFromSPDoc = async () => {
    const itemFolder1 =  await sp.web.getFolderByServerRelativePath(uploadFilePath).files();//.items.getById(1).folder()
    setFolderList(itemFolder1)
  }
  // delete File
  const deleteFileFromSPDoc = async (filename: any) => {

    await sp.web.getFolderByServerRelativePath(uploadFilePath + "/" + filename).recycle().then(() => getFileInfoFromSPDoc());
  };



  // 上传文件 清空本地文件信息 Upload file to SPDoc , Clear local files' information
  const handleUploadClick = async () => {
    if (!fileList) {
      return;
    }

    getFileInfoFromSPDoc().then(() => {
      const data = new FormData();
      var count = 0;
      const docFiles = itemFolder ? [...itemFolder] : [];
      files.forEach(async (file, i) => {

        // 写个循环去解决重复的问题
        for (let x of docFiles) {
          //if(file.name.search(x.Name.slice(0,file.name.lastIndexOf(".")+1))>=0){
          if (x.Name.search(file.name.slice(0, file.name.lastIndexOf(".") + 1)) >= 0) {
            count = count + 1;
          }
        }
        if (count == 0) {
          var filename = file.name;
        } else {
          filename = file.name.slice(0, file.name.lastIndexOf(".")) + count + file.name.slice(file.name.lastIndexOf(".")) //"hello,world.xls".slice(0,"hello,world.xls".lastIndexOf("."))+"1"
        }

        data.append(`file-${i}`, file, filename);
        const fileNamePath = encodeURI(filename);
        await sp.web.getFolderByServerRelativePath(uploadFilePath).files.addUsingPath(fileNamePath, file, { Overwrite: false }).then(() => getFileInfoFromSPDoc());
      })
      setFileList(null);
    });
  };


  const columns: IColumn[] = [
    {
      key: 'column1',
      name: 'File Name',
      iconName: 'Page',
      isIconOnly: true,
      fieldName: 'name',
      minWidth: 16,
      maxWidth: 16,
      onRender: (item: any) => {
          // TODO: 如展示不正确 修改这里
          const fileType = item?.Name.slice(item?.Name.lastIndexOf(".")+1);
          const fileicon = `https://res-1.cdn.office.net/files/fabric-cdn-prod_20221209.001/assets/item-types/16/${fileType}.svg`;
          
        return (
            <TooltipHost content={`${fileType} file`}>
              <img src={fileicon} />
            </TooltipHost>
          )
      },
    },
    {
      key: 'column2',
      name: 'File Name',
      fieldName: 'Name',
      minWidth: 210,
      maxWidth: 350,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      isSortedDescending: false,
      data: 'string',
      isPadded: true,
      onRender: (item: any) => {
          // TODO: 如展示不正确 修改这里
        return <span>{item.Name}</span>
      },
    },
    {
      key: 'column3',
      name: 'Date Modified',
      fieldName: 'dateModifiedValue',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      data: 'number',
      onRender: (item) => {
          // TODO: 如展示不正确 修改这里
        return <span>{format(new Date(item.TimeLastModified), "yyyy/MM/dd hh:mm:ss")}</span>;
      },
      isPadded: true,
    },
    {
      key: 'column4',
      name: 'File Size',
      fieldName: 'fileSizeRaw',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'number',
      onRender: (item) => {
          // TODO: 如展示不正确 修改这里
        return <span>{Math.floor(Number(item.Length) / 1024) + "KB"}</span>;
      },
    },
     {
      key: 'column5',
      name: 'Opreation',
      fieldName: 'fileSizeRaw',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'number',
      onRender: (item) => {
        // TODO: 用个icon替换
        return <span onClick={() => deleteFileFromSPDoc(item.Name)}>X</span>;
      },
    },
  ];


  const columnsUpload: IColumn[] = [
    {
      key: 'column1',
      name: 'File Name',
      iconName: 'Page',
      isIconOnly: true,
      fieldName: 'name',
      minWidth: 16,
      maxWidth: 16,
      onRender: (item: any) => {
          // TODO: 如展示不正确 修改这里
          const fileType = item?.name.slice(item?.name.lastIndexOf(".")+1);
          const fileicon = `https://res-1.cdn.office.net/files/fabric-cdn-prod_20221209.001/assets/item-types/16/${fileType}.svg`;
          return (
            <TooltipHost content={`${fileType} file`}>
              <img src={fileicon} />
            </TooltipHost>
          )
      },
    },
    {
      key: 'column2',
      name: 'File Name',
      fieldName: 'Name',
      minWidth: 210,
      maxWidth: 350,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      isSortedDescending: false,
      data: 'string',
      isPadded: true,
      onRender: (item: any) => {
          // TODO: 如展示不正确 修改这里
        return <span>{item.name}</span>
      },
    },
    {
      key: 'column3',
      name: 'Date Modified',
      fieldName: 'dateModifiedValue',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      data: 'number',
      onRender: (item) => {
          // TODO: 如展示不正确 修改这里
        return <span>{format(new Date(), "yyyy/MM/dd hh:mm:ss")}</span>;
      },
      isPadded: true,
    },
    {
      key: 'column4',
      name: 'File Size',
      fieldName: 'fileSizeRaw',
      minWidth: 70,
      maxWidth: 90,
      isResizable: true,
      isCollapsible: true,
      data: 'number',
      onRender: (item) => {
          // TODO: 如展示不正确 修改这里
        return <span>{Math.floor(Number(item.size) / 1024) + "KB"}</span>;
      },
    },
    //  {
    //   key: 'column5',
    //   name: 'Opreation',
    //   fieldName: 'fileSizeRaw',
    //   minWidth: 70,
    //   maxWidth: 90,
    //   isResizable: true,
    //   isCollapsible: true,
    //   data: 'number',
    //   onRender: (item) => {
    //     // TODO: 用个icon替换
    //     return <span onClick={() => deleteFileFromSPDoc(item.Name)}>X</span>;
    //   },
    // },
  ];



  const files = fileList ? [...fileList] : [];
  const docFiles = itemFolder ? [...itemFolder] : [];
  return (
    <div>
      <div>

        <div style={{ textAlign: "left", float: "left" }}>

          <span><span className={styles.title}>{mainTitle}</span>{titleDiscription} </span>
        </div>
        <div style={{ textAlign: "right", float: "right", justifyContent: "flex-end" }}>{mandatoryBool ? <span>{checkboxTitle}</span> : <div onChange={onclick_checkboxValue}><Checkbox label={checkboxTitle} ></Checkbox></div>}</div>
      </div>
      <br></br>

      <br></br>
      {/* 展示 从文件夹展示的数据 */}
      
      
      <div style={{ display: checkboxState }}>

        {fileUploadControlBool && <hr style={{ display: checkboxState }}></hr>}

        {fileUploadControlBool&&<DetailsList 
            items={docFiles || []}
            setKey="none"
            selectionMode={SelectionMode.none}
            columns={columns}
            getKey={(item: any ) => item.key }
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
        />}
        
      </div>

      {files.length>0&&<div style={{ textAlign: "left", display: checkboxState }}>

        <DetailsList
            items={files || []}
            setKey="none"
            selectionMode={SelectionMode.none}
            columns={columnsUpload}
            getKey={(item: any ) => item.key }
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
        />
      </div>}
      {fileUploadControlBool ? <label className={styles['custom-file-upload']} style={{ display: checkboxState }}><Icon iconName='Attach' className={styles.icon} />Select Files<input type="file" onChange={handleFileChange} multiple style={{ display: "none" }} />

</label> :
  <div><label style={{ textAlign: "left", float: "left", width: 150, display: checkboxState }}>JIRA Number</label> <input id='JiraInput' type='text' onChange={(e) => onchange_inputValue(e)} style={{ textAlign: "left", float: "left", height: 18, display: checkboxState }}></input></div>}
      <br></br>
      <br></br>
      {!fileUploadControlBool ? <div style={{ textAlign: 'left', display: checkboxState }}><PrimaryButton onClick={saveInputText} disabled={saveJiraDisable} >Save</PrimaryButton></div> : <div style={{ textAlign: 'left', display: checkboxState }}><PrimaryButton onClick={handleUploadClick} disabled={files.length <= 0} >Save</PrimaryButton></div>}
      <br ></br>
      <hr style={{ height: 10, color: 'transparent', opacity: 0.0, display: checkboxState }}></hr>

    </div>

  );
}

export default FileUploadMultiple;