# MovieMate
## Overview
MovieMate provides a simple and user-friendly solution for movie enthusiasts who struggle to find relevant and accurate information. MovieMate allows fuzzy search and full-text search, which improves flexibility. Additionally, this application serves as a solid starting point for further development, such as implementing payment options and personalized recommendation systems. Throughout the development process, with features and theories covered in the class, methods for improving performance through the utilization of normalization and query optimization have been explored.

## Demo link: 
https://drive.google.com/file/d/1Zl6QjXRinFMqK_uYCgaCklU_WBmPA-PE/view?usp=share_link

## Technology Stack and System Architecture
### List of technologies
- Python(Jupyter Notebook): data cleansing and data scrap- ing
- MySql: managing the data
- Node.js: running environment for JavaScript
- React: building interactive user interface
- CSS: styling and formatting web pages
- HTML: creating structures and contents of the webpage
- MUL: building visually appealing web applications
- Recharts: create interactive and responsive charts and graphs
- Git: version control
- Postman: API testing
- Midjourney: generating logo
- Balsamic Mockup: interface design tool for creating wireframes
- Premiere Pro: demo editing

## System Architecture
<img width="632" alt="image" src="https://user-images.githubusercontent.com/47569565/235719682-28de4ee1-e479-49dc-8f6b-ea4688cc6660.png">

## ER Diagram
<img width="632" alt="image" src="https://user-images.githubusercontent.com/47569565/235720329-bee8a0a3-36d8-4798-a626-47a12e45885e.png">

## Query Optimization
- For 1,2,3, and other queries: performance improved by switch from AND to JOIN, eliminating unnecessary columns, minimizing the number of joins required, and pushing selections and projections ahead of joins, which reduced the amount of data processed.
- Improved the Oscar movie recommendation(4) by replac- ing the CTE with a subquery and counting the number of Oscar nominations in the same query with selecting Oscar winning movies. This optimization led to a faster and more efficient Optimized query, which only requires two joins compared to the old query’s four joins.
- By implementing subqueries to perform aggregations be- fore joining tables and including the WHERE statement within the subquery, we minimized the amount of data being joined. This resulted in significantly faster query ex- ecution. Furthermore, we utilized the IFNULL function to effectively handle null values and ensure the query did not encounter any errors in case of null values within the database. Overall, these optimization techniques improved the efficiency and robustness of the top Oscar director query.
- For the query related to legendary actresses, we optimized the code by combining some subqueries and minimizing the number of joins, which decreased the overall computation time. To further enhance query performance, we utilized the STR_TO_DATE function to convert the date_of_birth column into a date format to address the data type issue.
<img width="332" alt="image" src="https://user-images.githubusercontent.com/47569565/235720968-6686fd92-76e2-482b-b581-7164fa349c9c.png">


## Team members
- Songyang Du Github: https://github.com/SongyangD
- Shengyin Si Github: https://github.com/Shelly0104
- Yahan Xu Github: https://github.com/gooyoowoo
- Yu Yang Github:https://github.com/yuyang2048

