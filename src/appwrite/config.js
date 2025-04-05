import { Client, Databases, ID } from "appwrite";
import conf from "../conf";

const client = new Client()
  .setEndpoint(conf.appwriteUrl)
  .setProject(conf.appwriteProjectId);

const databases = new Databases(client);

class AppwriteService {
  async saveChat(conversationId, title, messages) {
    try {
      const response = await databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        conversationId || ID.unique(),
        { title, messages, createdAt: new Date().toISOString() }
      );
      return response;
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

  async getAllChats() {
    try {
      const response = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId
      );
      return response.documents; // Returns a list of all chats with titles
    } catch (error) {
      console.error("Error fetching chats:", error);
      return [];
    }
  }
}

export const appwriteService = new AppwriteService();
