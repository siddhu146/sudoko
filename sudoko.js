let sudoko_box=document.querySelector('.input');
document.querySelector('.instructions').innerHTML=`<p class="instruction-text">Enter 0 or leave blank space at the places where there are no numbers</p>`;

//function to generate buttons in each row
function generate_row(i,n){
    let html='';
    for(j=0;j<n;j++){
        html+=`<input class="button" type="number" min=${1} max=${n}  data-i-val=${i} data-j-val=${j}>`;
    }
    return html;
};
//generating whole grid
function generate_grid(n){
    let html='';
    for(let i=0;i<n;i++){
        html+=`<div class="row">
                    ${generate_row(i,n)}
                </div>`;
    };
    //selecting the element from DOM to insert our html
    document.querySelector('.input').innerHTML=html;
    document.querySelector('.solve').innerHTML=`<button class="solve-button">SOLVE</button>
    <button class="refresh">REFRESH</button>`;
}
document.querySelector('.input').innerHTML='<p class="text-initial">Select the size of Matrix</p>';

//adding buttons for selecting thr grid size
document.querySelectorAll('.select-button')
.forEach((button)=>{
    button.addEventListener('click',()=>{
        //getting the size of n from buttons
        let n=button.dataset.valN;
        let res=intialise_matrix(n);//this array is for the output
        generate_grid(n);
        let sudoko_matrix=intialise_matrix(n);//this array if for input
        document.querySelector('.solve-button').addEventListener('click',()=>{
            let count=0;
            //grtting input from the grid by selecting each button
            document.querySelectorAll('.button').forEach((button)=>{
                //from each butto we can get the x and y coordinates
                let i = parseInt(button.dataset.iVal, 10);
                let j = parseInt(button.dataset.jVal, 10);
                let val=parseInt(button.value);//getting the value inside the input button
                if(isNaN(val)){//checking if no value is entered
                    sudoko_matrix[i][j]=0;
                }
                else sudoko_matrix[i][j]=val;
                //checking whether the input enteren is valid
                if(sudoko_matrix[i][j]>n||sudoko_matrix[i][j]<0){
                    count++;
                }
            });
            if(count>0){
                alert(`Enter the numbers between the range of 1 and ${n}`);
            }
            else{
                solve(sudoko_matrix,n);
                //console.log(sudoko_matrix);
            };
        });
        document.querySelector('.refresh').addEventListener('click',()=>{
            res=[];
            refresh();
            document.querySelector('.instructions').innerHTML=`<p class="instruction-text">Enter 0 or leave blank space at the places where there are no numbers</p>`;
        });
    })
})

//creating a matrix of size n
function intialise_matrix(n){
    let arr=new Array(n);
    for(let i=0;i<n;i++){
        arr[i]=new Array(n);
    };
    return arr;
}


//for displaying the matrix
function display(matrix){
    document.querySelectorAll('.button')
    .forEach((button)=>{
        let i = parseInt(button.dataset.iVal, 10);
        let j = parseInt(button.dataset.jVal, 10);
        button.value=matrix[i][j];
    })
}
function refresh(){
    document.querySelectorAll('.button')
    .forEach((button)=>{
        button.value='';
    })
}

function helper(matrix,dp,n,i,j){
    if(j==n){
        //if the grid is filled
        res=matrix;
        return true;
    }
    if(i==n){
        //if the x coordinate is moving out of grid 
        //we move to the next coloumn
        return helper(matrix,dp,n,0,j+1);
    }
    if(dp[i][j]==1){
        //checking whther the user has entered in that selected box
        //if entered move to next box
       return helper(matrix,dp,n,i+1,j);
    }
    //else check all possible numbers
    for(let num=1;num<n+1;num++){
        //check a number satisfies or not
        if(satisfy(matrix,i,j,num,n)){
            //save the selected number
            matrix[i][j]=num;
            if(helper(matrix,dp,n,i+1,j)){
                return true;
            }
            //backtrack 
            matrix[i][j]=0;
        }
    }
    return false;
}
function satisfy(matrix,x,y,num,n){
    
    for(let k=0;k<n;k++){
        if((matrix[x][k]==num && k!=y)||(matrix[k][y]==num && k!=x)){
            return false;
        }
    }

    //checking in the sub grid
    let a=Math.sqrt(n);
    let startx=Math.floor(x / a)*a;//getting the starting x coordinate of the sub-grid
    let starty=Math.floor(y / a)*a;//getting the starting y coordinate of the sub-grid
    for(let k=startx;k<startx+a;k++){
        for(let j=starty;j<starty+a;j++){
            if(matrix[k][j]==num && (x!=k && y!=j)){
                return false;
            }
        }
    }

    //if the number that system has chose is not present in that particular roe and coloumn
    return true;
}
function initial_check(matrix,n){
    for(let i=0;i<n;i++){
        for(let j=0;j<n;j++){
            if(matrix[i][j]!=0){
                if(!satisfy(matrix,i,j,matrix[i][j],n)){
                    console.log(`ival=${i} jval=${j}`);
                    return false;
                }
            }
        }
    }
    return true;
}
function solve(matrix,n){
    let dp=intialise_matrix(n);//for storing the user input
    if(!initial_check(matrix,n)){
        document.querySelector('.instructions').innerHTML=`<p class="instruction-text">Cannot form a valid sudoko</p>`;
        return ;
    }
    for(let i=0;i<n;i++){
        for(let j=0;j<n;j++){
            if(matrix[i][j]!=0){
                dp[i][j]=1;
            }
            else dp[i][j]=0;
        }
    }
    if(helper(matrix,dp,n,0,0)){
        display(res);
    }
    else 
    {
        document.querySelector('.instructions').innerHTML=`<p class="instruction-text">Cannot form a valid sudoko</p>`
    }
}

