import { Icon } from 'office-ui-fabric-react';
import *  as React from 'react';
import {  useEffect, useState } from 'react';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import { getFileTypeIconProps } from '@fluentui/react-file-type-icons';

initializeFileTypeIcons();
function IconSelected(props: {fileSuffix:string})    {
    const { fileSuffix } = props
    const [iconname, seticonname] = useState(String);
    useEffect(() => {
        handleFileSuffix(fileSuffix)
    }, [])
    const handleFileSuffix = (fileSuffix: string) => {
        // console.log("方法调用")
        if (!fileSuffix) {
            return;
        };
        switch (fileSuffix) {
            case ".csv":
            case ".xlsx":
               
                seticonname("csv");
                //iconname = "ExcelDocument";
                
                break;

            case ".ppt":
            case ".pptx":
                seticonname("ppt");
                break;
            case ".doc":
                seticonname("doc");
                break;
            default:
                seticonname("Folder");


        }


    }
   
    return (




        <Icon {...getFileTypeIconProps({ extension: iconname, size: 16, imageFileType: 'png' })} />

    )




}

export default IconSelected 