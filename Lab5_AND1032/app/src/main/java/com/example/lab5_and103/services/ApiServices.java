package com.example.lab5_and103.services;

import com.example.lab5_and103.model.Distributor;
import com.example.lab5_and103.model.Response;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface ApiServices {
    public static String BASE_URL = "http://192.168.1.5:3000/distributor/";

    @GET("list")
        Call<Response<ArrayList<Distributor>>> getListDistributor();

    @GET("search-distributor")
        Call<Response<ArrayList<Distributor>>> searchDistributor(@Query("key") String key);

    @POST("add")
    Call<Response<Distributor>> addDistributor(@Body Distributor distributor);

    @PATCH("edit/{id}")
    Call<Response<Distributor>> updateDistributor(@Path("id") String id,@Body Distributor distributor);

    @DELETE("delete/{id}")
    Call<Response<Distributor>> deleteDistributor(@Path("id") String id);






}


