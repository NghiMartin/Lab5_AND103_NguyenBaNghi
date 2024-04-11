package com.example.lab5_and103.services;

import com.example.lab5_and103.model.Distributor;
import com.example.lab5_and103.model.Fruit;
import com.example.lab5_and103.model.Page;
import com.example.lab5_and103.model.Response;
import com.example.lab5_and103.model.User;

import java.util.ArrayList;
import java.util.Map;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Multipart;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Part;
import retrofit2.http.PartMap;
import retrofit2.http.Path;
import retrofit2.http.Query;
import retrofit2.http.QueryMap;

public interface ApiServices {
//    public static String BASE_URL = "http://192.168.1.7:3000/distributor/";
public static String BASE_URL = "http://172.16.52.54:3000/";
    // CRUD DISTRIBUTOR
    @GET("distributor/list")
    Call<Response<ArrayList<Distributor>>> getListDistributor();

    @GET("distributor/search-distributor")
    Call<Response<ArrayList<Distributor>>> searchDistributor(@Query("key") String key);

    @POST("distributor/add")
    Call<Response<Distributor>> addDistributor(@Body Distributor distributor);

    @PATCH("distributor/edit/{id}")
    Call<Response<Distributor>> updateDistributor(@Path("id") String id,@Body Distributor distributor);

    @DELETE("distributor/delete/{id}")
    Call<Response<Distributor>> deleteDistributor(@Path("id") String id);

    // USER AUTHENTICATION
    @Multipart
    @POST ("user/add")
    Call<Response<User>> register(@Part("username")RequestBody username,
                                  @Part("password") RequestBody password,
                                  @Part("email") RequestBody email,
                                  @Part("name") RequestBody name,
                                  @Part MultipartBody.Part avatar);
    @POST ("user/login")
    Call<Response<User>> login(@Body User user);

    // CRUD FRUIT
    @GET("fruit/get-list-fruit")
    Call<Response<ArrayList<Fruit>>> getListFruit(@Header("Authorization") String token);
    @Multipart
    @POST("fruit/add")
    Call<Response<Fruit>> addFruitWithImage(@PartMap Map<String,RequestBody> requestBodyMap, @Part ArrayList<MultipartBody.Part> lsImage);


    @GET("fruit/get-page-fruit")
    Call<Response<Page<ArrayList<Fruit>>>> getPageFruit(@QueryMap Map<String, String> stringMap);

    @Multipart
    @PATCH("fruit/edit/{id}")
    Call<Response<Fruit>> updateFruitWithFileImage(@PartMap Map<String, RequestBody> requestBodyMap,
                                                   @Path("id") String id,
                                                   @Part ArrayList<MultipartBody.Part> ds_hinh
    );

    @DELETE("fruit/delete/{id}")
    Call<Response<Fruit>> deleteFruits(@Path("id") String id);

    @GET("fruit/getbyid/{id}")
    Call<Response<Fruit>> getFruitById (@Path("id") String id);
}


