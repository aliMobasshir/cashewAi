import { Client, Databases, ID } from "appwrite";
import conf from "../conf";
import { Query } from "appwrite"

const client = new Client()
  .setEndpoint(conf.appwriteUrl)
  .setProject(conf.appwriteProjectId);

const databases = new Databases(client);

class AppwriteService {
  async saveChat(conversationId, userId, title, messages) {
    try {
      if (conversationId) {
        // Update ONLY messages
        const response = await databases.updateDocument(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionId,
          conversationId,
          {
            messages: JSON.stringify(messages),
          }
        );
        return response;
      } else {
        // First time: create full document
        const response = await databases.createDocument(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionId,
          ID.unique(),
          {
            userId,
            title,
            messages: JSON.stringify(messages),
            createdAt: new Date().toISOString(),
          }
        );
        return response;
      }
    } catch (error) {
      console.error("Error saving chat:", error);
      return null;
    }
  }
  
  

  async getChat(conversationId) {
    try {
      const response = await databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        conversationId
      );
      return response;
    } catch (error) {
      console.error("Error fetching chat:", error);
      return null;
    }
  }

  async getAllChats(userId) {
    try {
      const response = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal("userId", userId)]
      );
      return response.documents; // Returns a list of all chats with titles
    } catch (error) {
      console.error("Error fetching chats:", error);
      return [];
    }
  }
}

export const appwriteService = new AppwriteService();
