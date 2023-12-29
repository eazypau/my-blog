import { Client } from "@notionhq/client";

export interface Blog {
  id: string;
  title: string;
  tags: string[];
  description: string;
  date: string;
  slug: string;
}

interface BlogList {
  id: string;
  type: string;
  children: any[];
}

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const getBlogDetails = (post: any): Blog => {
  const getTags = () => {
    return post.properties.Tags.multi_select.map((item: any) => item.name);
  };

  return {
    id: post.id,
    title: post.properties.Title.title[0].plain_text,
    tags: getTags(),
    description: post.properties.Description.rich_text[0].plain_text,
    date: post.properties.Date.date.start,
    slug: post.properties.Slug.rich_text[0].plain_text,
  };
};

export const getAllPublished = async () => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        property: "Status",
        status: {
          equals: "Published",
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    return response.results.map((item) => getBlogDetails(item));
  } catch (error: any) {
    console.error(error);
    const errText = error.toString();
    console.log("error message: ", errText);
    return [];
  }
};

export const getPageBlocks = async (pageId: string) => {
  const response = await notion.blocks.children.list({ block_id: pageId });

  if (response.results.length > 0) {
    const results = response.results as any[];
    const bulletedListItemIndex: number[] = [];
    const bulletedList: BlogList = {
      id: Math.floor(Math.random() * 100000).toString(),
      type: "bulleted_list",
      children: [],
    };
    const numberedListItemIndex: number[] = [];
    const numberedList: BlogList = {
      id: Math.floor(Math.random() * 100000).toString(),
      type: "numbered_list",
      children: [],
    };
    results.forEach((block, index) => {
      if (block.type === "bulleted_list_item") {
        bulletedListItemIndex.push(index);
        bulletedList.children.push(block);
      }
      if (block.type === "numbered_list_item") {
        numberedListItemIndex.push(index);
        numberedList.children.push(block);
      }
    });

    if (bulletedListItemIndex.length) {
      bulletedListItemIndex.forEach((itemIndex, index) => {
        if (index === 0) {
          results[itemIndex] = bulletedList;
        } else {
          results[itemIndex] = {};
        }
      });
    }
    if (numberedListItemIndex.length) {
      numberedListItemIndex.forEach((itemIndex, index) => {
        if (index === 0) {
          results[itemIndex] = numberedList;
        } else {
          results[itemIndex] = {};
        }
      });
    }

    // https://stackoverflow.com/questions/33884033/how-can-i-remove-empty-object-in-from-an-array-in-js
    return results.filter((value) => Object.keys(value).length !== 0);
  } else return [];
};

export const getBlogPageBySlug = async (slug: string): Promise<Blog | {}> => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: "Slug",
      formula: {
        string: {
          equals: slug,
        },
      },
    },
  });

  if (response.results.length) {
    return getBlogDetails(response.results[0]);
  }

  return {};
};

export const getBlogsByTag = async (tag?: string) => {
  try {
    if (!tag) {
      return [];
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        property: "Tags",
        multi_select: {
          contains: tag,
        },
        and: [
          {
            property: "Status",
            status: {
              equals: "Published",
            },
          },
        ],
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    return response.results.map((item) => getBlogDetails(item));
  } catch (error: any) {
    console.error(error);
    const errText = error.toString();
    console.log("error message: ", errText);
    return [];
  }
};
