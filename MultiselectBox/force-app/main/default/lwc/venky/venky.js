import { LightningElement, track, wire,api } from 'lwc';
import getProductList from  '@salesforce/apex/GetProductList.getProductList';
import saveprods from  '@salesforce/apex/GetProductList.save';



export default class Venky extends LightningElement {
    @track dataList = [];
    @track selectedItemList = [];
    @track eventList = [];
    @api products;
    @track tempdata = [];

    @wire(getProductList) ProductList(result){
        let tempdata = [];
        let temp;
        if(result.data)
        {
        temp = result.data[0].Products__c;
        this.dataList = temp.split('\n');
        this.tempdata = temp.split('\n');
        }
    }

    selectItem(event)
    {
        const val = event.currentTarget.getAttribute("data-id");
        let index = this.dataList.indexOf(val);
        if(!this.selectedItemList.includes(index))
        {
            this.selectedItemList.push(index);
            event.currentTarget.style.color = "blue";
            if(!this.eventList.includes(index))
            {
                this.eventList.push(event.currentTarget);
            }
        }
        else {
            
            this.selectedItemList.splice(this.selectedItemList.indexOf(index), 1);
            event.currentTarget.style.color = "black";
            
        }
    }

    moveUp ()
    {
        this.selectedItemList.sort(); //sorting Selected List so it doesn't matter in which order you select items
        let flag=false; //flag to check if any element is moved
        for (let item of this.selectedItemList)
        {
            if (item > 0 && this.selectedItemList[0]!=0 && item != null)
            {
                flag=true;
                const temp = this.dataList[item]; 
                this.dataList[item] = this.dataList[item - 1];
                this.dataList[item - 1] = temp;
            }
        }
        if(flag){
        for(let i=0;i<this.selectedItemList.length;i++){
            this.selectedItemList[i]-=1
        }
    }
    }

    moveDown ()
    {
        this.selectedItemList.sort().reverse(); //sorting and reversing Selected List so it doesn't matter in which order you select items
        let flag=false; //flag to check if any element is moved
        for (let item of this.selectedItemList)
        { 
            if (item < this.dataList.length - 1 && this.selectedItemList[0]!=this.dataList.length-1 && item != null)
            {
                flag=true;
                const temp = this.dataList[item]; 
                this.dataList[item] = this.dataList[item + 1];
                this.dataList[item + 1] = temp;
            }
        }
        if(flag){
        for(let i=0;i<this.selectedItemList.length;i++){
            this.selectedItemList[i]+=1
        }
    }

    }
    checkAlreadyTop(){
        // checking if the value selected is already on top
        let flag=false;
        let TopIndex=0;
        for (let item of this.selectedItemList.sort())
        {
            if(item==TopIndex)
            {
                TopIndex++;
            }
            else
            {
                flag=true;
            }
        
        }
        return flag
    }
    checkAlreadyBottom(){
        // checking if the value selected is already on bottom
        let flag=false;
        let BottomIndex=this.dataList.length-1;
        for (let item of this.selectedItemList.sort().reverse())
        {
            if(item==BottomIndex)
            {
                BottomIndex--;
            }
            else
            {
                flag=true;
            }
        
        }
        return flag
    }
    moveTop ()
    {
        if(this.checkAlreadyTop()){
        let LastIndex=this.selectedItemList.length-1; //last index of selected list
        let count=1; //count to check number of items moved
        for (let item of this.selectedItemList.sort().reverse())
        {
            if (item > 0 && item != null)
            {
                let temp = this.dataList[item];
                this.dataList.splice(item, 1);
                this.dataList.unshift(temp);
                //As element goes to top add 1 in index of rest of elements
                this.selectedItemList[this.selectedItemList.indexOf(item)]=LastIndex;
                for(let i=count;i<this.selectedItemList.length;i++){
                    this.selectedItemList[i]+=1
                }
                count++;
                LastIndex--;
            }
        }
    }
    }

    moveBottom ()
    {
        if(this.checkAlreadyBottom()){
            let LastIndex=this.dataList.length-1; //last index of selected list
            let count=1; //count to check number of items moved
            for (let item of this.selectedItemList.sort())
            {            
                if (item < this.dataList.length-1  && item != null)
                {
                    let temp = this.dataList[item];
                    this.dataList.splice(item, 1);
                    this.dataList.push(temp);
                    //As element goes to top add 1 in index of rest of elements
                    this.selectedItemList[this.selectedItemList.indexOf(item)]=LastIndex;
                    for(let i=count;i<this.selectedItemList.length;i++){
                        this.selectedItemList[i]-=1
                    }
                    count++;
                    LastIndex--;
                }
        
            }
        }
    }
    async save()
    {
        for (let i = 0; i<this.eventList.length; i++)
        {
           this.eventList[i].style.color = "black";
        }
        let products= this.dataList.join('\n');
        this.selectedItemList = [];
        await saveprods({products});
    }

    cancel ()
    {

        for (let i = 0; i<this.eventList.length; i++)
        {
           this.eventList[i].style.color = "black";
        }
        this.dataList = this.tempdata;
        this.selectedItemList = [];
    }
    
}