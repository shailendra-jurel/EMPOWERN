// src/calls/baseApiService.js
import { apiHelpers } from '../utils/api/helpers';
import { ApiCache } from '../utils/api/cache';

export class BaseApiService {
constructor(axiosInstance, endpoint) {
this.axios = axiosInstance;
this.endpoint = endpoint;
this.cache = new ApiCache();
}

async get(id, useCache = false) {
try {
    if (useCache) {
    return await this.cache.get(
        `${this.endpoint}/${id}`,
        () => this.axios.get(`${this.endpoint}/${id}`)
    );
    }
    const response = await apiHelpers.withRetry(() => 
    this.axios.get(`${this.endpoint}/${id}`)
    );
    return response.data;
} catch (error) {
    apiHelpers.handleError(error, `get ${this.endpoint}`);
}
}

async getAll() {
try {
    const response = await apiHelpers.withRetry(() => 
    this.axios.get(this.endpoint)
    );
    return response.data;
} catch (error) {
    apiHelpers.handleError(error, `get all ${this.endpoint}`);
}
}

async create(data) {
try {
    const response = await apiHelpers.withRetry(() => 
    this.axios.post(this.endpoint, data)
    );
    return response.data;
} catch (error) {
    apiHelpers.handleError(error, `create ${this.endpoint}`);
}
}

async update(id, data) {
try {
    const response = await apiHelpers.withRetry(() => 
    this.axios.put(`${this.endpoint}/${id}`, data)
    );
    return response.data;
} catch (error) {
    apiHelpers.handleError(error, `update ${this.endpoint}`);
}
}

async delete(id) {
try {
    const response = await apiHelpers.withRetry(() => 
    this.axios.delete(`${this.endpoint}/${id}`)
    );
    return response.data;
} catch (error) {
    apiHelpers.handleError(error, `delete ${this.endpoint}`);
}
}
}