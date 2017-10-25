# act-executions-wait-finish

This act accepts an array of ExecutionIDs and waits for all of them to finish.

If a __finalWebhook__ attribute is provided, after all the executions finish, the result will be sent to that URL.

__Example input:__
```javascript
{ 
    "executionIds": [
        EXECUTION_ID_1, 
        EXECUTION_ID_2, 
        EXECUTION_ID_3,
        ...
    ],
    "finalWebhook": FINAL_WEBHOOK_URL
}
```

The output is again an array of executionIds.
