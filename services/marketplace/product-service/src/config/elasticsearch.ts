import { Client } from '@elastic/elasticsearch';

export class ElasticsearchService {
  private static instance: Client;

  static getInstance(): Client {
    if (!ElasticsearchService.instance) {
      ElasticsearchService.instance = new Client({
        node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
        auth: process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD
          ? {
              username: process.env.ELASTICSEARCH_USERNAME,
              password: process.env.ELASTICSEARCH_PASSWORD,
            }
          : undefined,
      });

      console.log('✅ Elasticsearch client initialized');
    }

    return ElasticsearchService.instance;
  }

  static async testConnection(): Promise<boolean> {
    try {
      const client = ElasticsearchService.getInstance();
      const health = await client.cluster.health();
      console.log('✅ Elasticsearch connection successful:', health.status);
      return true;
    } catch (error) {
      console.error('❌ Elasticsearch connection failed:', error);
      return false;
    }
  }

  /**
   * Initialize products index with French language analyzer
   */
  static async initializeProductsIndex(): Promise<void> {
    const client = ElasticsearchService.getInstance();
    const indexName = 'products';

    try {
      const exists = await client.indices.exists({ index: indexName });

      if (!exists) {
        await client.indices.create({
          index: indexName,
          body: {
            settings: {
              number_of_shards: 1,
              number_of_replicas: 1,
              analysis: {
                filter: {
                  french_elision: {
                    type: 'elision',
                    articles_case: true,
                    articles: [
                      'l', 'm', 't', 'qu', 'n', 's',
                      'j', 'd', 'c', 'jusqu', 'quoiqu',
                      'lorsqu', 'puisqu'
                    ],
                  },
                  french_stop: {
                    type: 'stop',
                    stopwords: '_french_',
                  },
                  french_stemmer: {
                    type: 'stemmer',
                    language: 'light_french',
                  },
                  agricultural_synonym: {
                    type: 'synonym',
                    synonyms: [
                      'bio,biologique,organique',
                      'céréale,grain',
                      'légume,végétal',
                      'fruit,produit frais',
                      'viande,protéine animale',
                      'lait,produit laitier',
                      'œuf,oeuf',
                      'blé,froment',
                      'maïs,corn',
                      'tracteur,engin agricole',
                    ],
                  },
                },
                analyzer: {
                  french_agricultural: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: [
                      'french_elision',
                      'lowercase',
                      'french_stop',
                      'french_stemmer',
                      'agricultural_synonym',
                    ],
                  },
                  autocomplete: {
                    type: 'custom',
                    tokenizer: 'autocomplete_tokenizer',
                    filter: ['lowercase'],
                  },
                  autocomplete_search: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: ['lowercase'],
                  },
                },
                tokenizer: {
                  autocomplete_tokenizer: {
                    type: 'edge_ngram',
                    min_gram: 2,
                    max_gram: 10,
                    token_chars: ['letter', 'digit'],
                  },
                },
              },
            },
            mappings: {
              properties: {
                id: { type: 'keyword' },
                name: {
                  type: 'text',
                  analyzer: 'french_agricultural',
                  fields: {
                    keyword: { type: 'keyword' },
                    autocomplete: {
                      type: 'text',
                      analyzer: 'autocomplete',
                      search_analyzer: 'autocomplete_search',
                    },
                  },
                },
                slug: { type: 'keyword' },
                description: {
                  type: 'text',
                  analyzer: 'french_agricultural',
                },
                shortDescription: {
                  type: 'text',
                  analyzer: 'french_agricultural',
                },
                category: {
                  type: 'keyword',
                  fields: {
                    text: {
                      type: 'text',
                      analyzer: 'french_agricultural',
                    },
                  },
                },
                subCategory: { type: 'keyword' },
                price: { type: 'float' },
                originalPrice: { type: 'float' },
                unit: { type: 'keyword' },
                stock: { type: 'integer' },
                sku: { type: 'keyword' },
                images: { type: 'keyword' },
                tags: {
                  type: 'keyword',
                  fields: {
                    text: {
                      type: 'text',
                      analyzer: 'french_agricultural',
                    },
                  },
                },
                specifications: { type: 'object', enabled: false },
                sellerId: { type: 'keyword' },
                sellerName: {
                  type: 'text',
                  analyzer: 'french_agricultural',
                  fields: {
                    keyword: { type: 'keyword' },
                  },
                },
                rating: { type: 'float' },
                reviewCount: { type: 'integer' },
                status: { type: 'keyword' },
                featured: { type: 'boolean' },
                organic: { type: 'boolean' },
                certifications: { type: 'keyword' },
                origin: { type: 'keyword' },
                harvestDate: { type: 'date' },
                expiryDate: { type: 'date' },
                createdAt: { type: 'date' },
                updatedAt: { type: 'date' },
                suggest: {
                  type: 'completion',
                  analyzer: 'autocomplete',
                  contexts: [
                    {
                      name: 'category',
                      type: 'category',
                    },
                  ],
                },
              },
            },
          },
        });

        console.log(`✅ Created Elasticsearch index: ${indexName}`);
      } else {
        console.log(`ℹ️ Elasticsearch index already exists: ${indexName}`);
      }
    } catch (error) {
      console.error('❌ Failed to initialize Elasticsearch index:', error);
      throw error;
    }
  }

  static async close(): Promise<void> {
    if (ElasticsearchService.instance) {
      await ElasticsearchService.instance.close();
      console.log('Elasticsearch connection closed');
    }
  }
}
