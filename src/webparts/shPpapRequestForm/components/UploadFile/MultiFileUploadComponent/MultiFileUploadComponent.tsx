import * as React from 'react';
import { ChangeEvent, useEffect, useState } from 'react';
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import { spfi, SPFx } from "@pnp/sp";
import { IFileAddResult, IFileInfo } from '@pnp/sp/files';
import { getSP } from "../../../common/pnpjsConfig";
import { Button, Checkbox, Icon, Label, PrimaryButton } from 'office-ui-fabric-react';

import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import styles from "../../ShPpapRequestForm.module.scss";
import IconSelected from '../FileIcon/FileIconConponent';
import { IItemAddResult } from '@pnp/sp/items';

function MultiFileUploadComponent(props:any){
    const { mainTitle, titleDiscription, mandatoryBool, checkboxTitle, uploadFilePath, fileUploadControlBool  ,childTtitle} = props
    // 这是个钩子
    //const [fileList, setFileList] = useState<FileList | any>(null);
    const [fileList, setFileList] = useState<FileList | any>(null);
    const [itemFolder, setFolderList] = useState<IFileInfo | any>(null);
    const [jiraInputValue, setjiraInputValue] = useState<string>(null);
    const [checkboxState,setCheckboxState] = useState<string>(null)
    const [checkboxBool,setcheckboxBool] = useState<Boolean>(null)
    // var Refreshcode: number = Date.now();
    //const itemFolder:any =[]
    const _sp = getSP();
    const sp = spfi(_sp);
    
    useEffect(() => {
      getFileInfoFromSPDoc();
      setcheckboxBool(false)
    }, [])
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      //这步钩子是异步的
      setFileList(null);
      setFileList(e.target.files);
      return console.log(fileList)
      //console.log(fileList)
    };
  
    const onclick_checkboxValue=()=>{
      
      console.log(checkboxBool)
      if(checkboxBool){
        setCheckboxState("block")
      }else{
        setCheckboxState("none")
      }
      setcheckboxBool(!checkboxBool)
    }
  
    //监听 jira输入框的值
    const onchange_inputValue = (e:any) => {
      setjiraInputValue(e.target.value);
      console.log("e :"+e.target.value)
      console.log(jiraInputValue)
    }
  
    // 保存jira代码到SP
    const saveInputText = async () => {
  
      const iar: IItemAddResult = await sp.web.lists.getByTitle("Temp GPS Orders").items.add({
        title: "Title",
        JireNumber: jiraInputValue
      });
  
      console.log(iar);
      alert(iar)
  
    }
  
    // 加载 上传文件夹的数据
    const getFileInfoFromSPDoc = async () => {
      const itemFolder1 = await await sp.web.getFolderByServerRelativePath(uploadFilePath).files();//.items.getById(1).folder()
      setFolderList(itemFolder1)
      //console.log(itemFolder1)
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
  
          //data.append(`file-${i}`, file, file.name);
          //const fileNamePath = encodeURI(file.name);
          data.append(`file-${i}`, file, filename);
          const fileNamePath = encodeURI(filename);
          await sp.web.getFolderByServerRelativePath(uploadFilePath).files.addUsingPath(fileNamePath, file, { Overwrite: false }).then(() => getFileInfoFromSPDoc());
        })
  
        //   fetch('https://httpbin.org/post', {
        //     method: 'POST',
        //     body: data,
        //   })
        //     .then((res) => res.json())
        //     .then((data) => console.log(data))
        //     .catch((err) => console.error(err));
        //this.useState.setFileList(null);
  
        //files.length = 0;
        setFileList(null);
        //Refreshcode = Date.now();
      });
  
      //handleFileChangeclear;
    };
  
  
    const files = fileList ? [...fileList] : [];
    const docFiles = itemFolder ? [...itemFolder] : [];
    //console.log("DocFiles" +docFiles)
    return (
      <div>
      <div>

        <div style={{ textAlign: "left", float: "left" }}>

          {/* <span><span className={styles.title}>{mainTitle}</span>{titleDiscription} </span> */}
        </div>
       
      </div>
      <br></br>
      {/* <hr style={{ height: 1, color: 'black' }} /> */}
      {/* <Label>ABC</Label> */}
      <div style={{textAlign: "left"}}><span style={{fontWeight:700}}>{childTtitle}</span></div>
      
      {/* 展示 从文件夹展示的数据 */}
      <div>

        {fileUploadControlBool && <hr style={{display:checkboxState}}></hr>}
        {fileUploadControlBool && <div style={{ textAlign: "left",display:checkboxState }}>
        
          {docFiles.length>0&&<table style={{ tableLayout: "fixed" ,display:checkboxState}}>
            
            <thead style={{ textAlign: "left" }}>
              <tr> <th> File Name</th>
                <th>Date Uploaded</th>
                <th>Size</th>
                <th></th>

              </tr>
            </thead>
            {docFiles.map((file, index) => (

              <tr data-index={index} style={{ textAlign: "left" }}>
                <td className={styles.tdsetting}><IconSelected fileSuffix={file.Name.slice(file.Name.lastIndexOf("."))}></IconSelected>&nbsp;{file.Name}</td>
                {/* <td>{file.lastModifiedDate.toLocaleDateString()}</td>  */}
                <td width={150}>{format(new Date(file.TimeLastModified), "yyyy/MM/dd hh:mm:ss")}</td>
                <td width={60}>{Math.floor(Number(file.Length) / 1024) + "KB"}</td>
                {/* <td><PrimaryButton onClick={()=>deleteFileFromSPDoc(file.Name)}>Delete</PrimaryButton> </td> */}

                {/* <td width={60}><Label><a href='#' onClick={()=>deleteFileFromSPDoc(file.Name)}>     X</a></Label></td> */}
                <td width={60}><a href='#' onClick={() => deleteFileFromSPDoc(file.Name)}><Icon iconName='Cancel'></Icon></a></td>
              </tr>
            ))}
          </table>}

        </div>
        }
      </div>
      


      {/* {files.length > 0 && <hr style={{display:checkboxState}}></hr>} */}

      <div style={{ textAlign: "left" ,display:checkboxState}}>
        {files.length > 0 ? <table >
          {/* <span>将要上传的文件</span> */}
          <thead style={{ textAlign: "left" }}>
            <tr> <th> File Name</th>
              <th>Date Uploading</th>
              <th>Size</th>

            </tr>
          </thead>
          {files.map((file, index) => (
            <tr data-index={index} style={{ textAlign: "left" }}>
              <td className={styles.tdsetting}><IconSelected fileSuffix={file.name.slice(file.name.lastIndexOf("."))}></IconSelected>&nbsp;{file.name}</td>
              {/* <td>{file.lastModifiedDate.toLocaleDateString()}</td>  */}
              <td width={150}>{format(new Date(), "yyyy/MM/dd:hh:mm")}</td>
              <td width={60}>{Math.floor(file.size / 1024) + "KB"}</td>

            </tr>
          ))}
        </table> : null}
        {/* <ul>
        {files.map((file, i) => (
          <li key={i}>
            {file.name} - {file.type}
            
          </li>
        ))}
      </ul> */}
      </div>
      {fileUploadControlBool ? <label  className={styles['custom-file-upload']} style={{display:checkboxState}}><Icon iconName='Attach' className={styles.icon} />Select Files<input type="file" onChange={handleFileChange} multiple style={{ display: "none" }} />

      </label> :
        <div><label style={{ textAlign: "left", float: "left", width: 150 ,display:checkboxState}}>JIRA Number</label> <input id='JiraInput' type='text'  onChange={(e)=>onchange_inputValue(e)} style={{ textAlign: "left", float: "left", height: 18 ,display:checkboxState}}></input></div>}
      <br></br>
      <br></br>
      {!fileUploadControlBool ?<div style={{ textAlign: 'left',display:checkboxState }}><PrimaryButton onClick={saveInputText} disabled={jiraInputValue==null} >Save Jira</PrimaryButton></div>:<div style={{ textAlign: 'left',display:checkboxState }}><PrimaryButton onClick={handleUploadClick} disabled={files.length <= 0} >Save</PrimaryButton></div>}
      <br ></br>
      <hr style={{ height: 10, color: 'transparent', opacity: 0.0 ,display:checkboxState}}></hr>

    </div>
          
    )
}
export default MultiFileUploadComponent