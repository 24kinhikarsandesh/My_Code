#include <stdio.h>
#include <string.h>

#define MAX 100

int main() {
    char arrX[] = {'A','G','C','C','C','T','A','A','G','G','G','C','T','A','C','C','T','A','G','C','T','T'};
    char arrY[] = {'G','A','C','A','G','C','C','T','A','C','A','A','G','C','G','T','T','A','G','C','T','T','G'};

    int lenX = sizeof(arrX) / sizeof(arrX[0]);
    int lenY = sizeof(arrY) / sizeof(arrY[0]);

    int dp[MAX][MAX];
    char direction[MAX][MAX];  

    
    for (int i = 0; i <= lenX; i++) {
        for (int j = 0; j <= lenY; j++) {
            if (i == 0 || j == 0) {
                dp[i][j] = 0;
                direction[i][j] = '0';   
            }
            else if (arrX[i - 1] == arrY[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                direction[i][j] = 'D';   
            }
            else if (dp[i - 1][j] >= dp[i][j - 1]) {
                dp[i][j] = dp[i - 1][j];
                direction[i][j] = 'U';   
            }
            else {
                dp[i][j] = dp[i][j - 1];
                direction[i][j] = 'L';   
            }
        }
    }

    printf("Length of LCS = %d\n", dp[lenX][lenY]);

   
    int i = lenX, j = lenY;
    int index = dp[lenX][lenY];
    char lcs[MAX];
    lcs[index] = '\0';  

    while (i > 0 && j > 0) {
        if (direction[i][j] == 'D') {
            lcs[index - 1] = arrX[i - 1]; 
            i--;
            j--;
            index--;
        } else if (direction[i][j] == 'U') {
            i--;
        } else {
            j--;
        }
    }

    printf("LCS = %s\n", lcs);

   
    printf("\nCost Matrix:\n");
    for (int i = 0; i <= lenX; i++) {
        for (int j = 0; j <= lenY; j++) {
            printf("%c ", direction[i][j]);
        }
        printf("\n");
    }

    return 0;
}
