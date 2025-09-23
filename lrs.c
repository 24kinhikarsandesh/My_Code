#include <stdio.h>
#include <string.h>

void printTable(int dp[][100], int n, char *s) {
    printf("\nDP Table:\n    ");
    for (int i = 0; i < n; i++)
        printf(" %c ", s[i]);
    printf("\n");

    for (int i = 0; i <= n; i++) {
        if (i == 0) printf("  ");
        else printf("%c ", s[i-1]);

        for (int j = 0; j <= n; j++) {
            printf("%2d ", dp[i][j]);
        }
        printf("\n");
    }
}

int main() {
    char s[] = "AABCBDC";
    int n = strlen(s);

    int dp[100][100]; 
    
    for (int i = 0; i <= n; i++) {
        for (int j = 0; j <= n; j++) {
            if (i == 0 || j == 0)
                dp[i][j] = 0;
        }
    }

    
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            if (s[i-1] == s[j-1] && i != j) {
                dp[i][j] = 1 + dp[i-1][j-1];
            } else {
                dp[i][j] = (dp[i-1][j] > dp[i][j-1]) ? dp[i-1][j] : dp[i][j-1];
            }
        }
    }

    
    printTable(dp, n, s);

    
    int i = n, j = n;
    char lrs[100];
    int index = 0;

    while (i > 0 && j > 0) {
        if (s[i-1] == s[j-1] && i != j) {
            lrs[index++] = s[i-1];
            i--;
            j--;
        }
        else if (dp[i-1][j] >= dp[i][j-1]) {
            i--;
        }
        else {
            j--;
        }
    }
    lrs[index] = '\0';

    
    for (int k = 0; k < index/2; k++) {
        char temp = lrs[k];
        lrs[k] = lrs[index-1-k];
        lrs[index-1-k] = temp;
    }

    
    printf("\nString: %s\n", s);
    printf("Length of LRS: %d\n", dp[n][n]);
    printf("LRS: %s\n", lrs);

    return 0;
}
