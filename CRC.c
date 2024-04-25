#include<stdio.h>
#include<string.h>
#define N strlen(gen_poly)
char data[28];
char check_value[28];
char gen_poly[10];
int data_length,i,j;
void XOR(){
    for(j = 1;j < N; j++)
    check_value[j] = (( check_value[j] == gen_poly[j])?'0':'1');
}
void crc(){
    for(i=0;i<N;i++)
        check_value[i]=data[i];
    do{
        if(check_value[0]=='1')
            XOR();
        for(j=0;j<N-1;j++)
            check_value[j]=check_value[j+1];
        check_value[j]=data[i++];
    }while(i<=data_length+N-1);
}
void receiver(){
    printf("Enter the received data: ");
    scanf("%s", data);
    printf("\n-----------------------------\n");
    printf("Data received: %s", data);
    crc();
    for(i=0;(i<N-1) && (check_value[i]!='1');i++);
        if(i<N-1)
            printf("\nError detected\n\n");
        else
            printf("\nNo error detected\n\n");
}

int main()
{
    printf("\nEnter data to be transmitted: ");
    scanf("%s",data);
    printf("\n Enter the Generating polynomial: ");
    scanf("%s",gen_poly);
    data_length=strlen(data);
    for(i=data_length;i<data_length+N-1;i++)
        data[i]='0';
    printf("\n----------------------------------------");
    printf("\n Data padded with n-1 zeros : %s",data);
    printf("\n----------------------------------------");
    crc();
    printf("\nCRC or Check value is : %s",check_value);
    for(i=data_length;i<data_length+N-1;i++)
        data[i]=check_value[i-data_length];
    printf("\n----------------------------------------");
    printf("\n Final data to be sent : %s",data);
    printf("\n----------------------------------------\n");
    receiver();
        return 0;
}


/*
#include<stdio.h>
int main(){
	int n,f,frames[30],i;
	printf("Enter window size : ");
	scanf("%d",&n);
	printf("Enter number of frames to transmit: ");
	scanf("%d",&f);
	printf("Enter %d frames: \n",f);
	for(i=1;i<=f;i++){
		scanf("%d",&frames[i]);
	}
	printf("\nWith sliding window protocol the frames will be sent in the following manner (assuming no corruption of frames)\n\n");
	printf("After sending %d frames at each stage sender waits for acknowledgement sent by the receiver\n\n",n);

	for(i=1;i<=f;i++){
		if(i%n==0){
			printf("%d ",frames[i]);
			printf("\nAcknowledgement of above frames sent is received by sender\n\n");

		}
		else{
			//printf("recieved by sender\n");
			printf("%d ",frames[i]);
		}
	}
	if(f%n!=0){
	printf("\nAcknowledgement of above frames sent is received by sender\n");

	}
}
*/


/*
#include<stdio.h>
int main()
{
    int window=0;
	printf("enter Window size : ");
	scanf("%d",&window);
	int sent,ack,i=0;
	while(1){
		for(i=0;i<window;i++){
			printf("frame Transmitted %d \n",sent);
			sent++;
			if(sent==window){
				break;
			}
		}
		printf("enter last received acknowledgment : ");
		scanf("%d",&ack);
		if(ack==window){
			break;
		}
		else{
			sent = ack;
			}
    }
}
*/


