package com.example.lab5_and103;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.example.lab5_and103.databinding.ActivityRegisterBinding;
import com.example.lab5_and103.model.Response;
import com.example.lab5_and103.model.User;
import com.example.lab5_and103.services.HttpRequest;
import com.example.lab5_and103.view.LoginActivity;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;


import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;


public class RegisterActivity extends AppCompatActivity {
    private  ActivityRegisterBinding binding;
     File file;
    private HttpRequest httpRequest;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        binding = ActivityRegisterBinding.inflate(getLayoutInflater());
        super.onCreate(savedInstanceState);
        setContentView(binding.getRoot());

        httpRequest  = new HttpRequest();

        binding.btnSignUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RequestBody _username = RequestBody.create(MediaType.parse("multipart/form-data"),binding.edtUsername.getText().toString());
                RequestBody _password = RequestBody.create(MediaType.parse("multipart/form-data"),binding.edtPassword.getText().toString());
                RequestBody _email = RequestBody.create(MediaType.parse("multipart/form-data"),binding.edtEmail.getText().toString());
                RequestBody _name = RequestBody.create(MediaType.parse("multipart/form-data"),binding.edtFullname.getText().toString());
                MultipartBody.Part multipartBody;
                if(file != null) {
                    RequestBody requestFile = RequestBody.create(MediaType.parse("image/*"), file);
                    multipartBody = MultipartBody.Part.createFormData("avatar", file.getName(), requestFile);
                }else
                {
                    multipartBody = null;
                }
                httpRequest.callAPI().register(_username, _password, _email, _name, multipartBody).enqueue(responseUser);
            }
        });
        binding.avatar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                chooseImage();
            }
        });
        binding.txtLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(RegisterActivity.this, LoginActivity.class));
            }
        });
    }
    private void chooseImage() {
        if(ContextCompat.checkSelfPermission(this,
                Manifest.permission.READ_EXTERNAL_STORAGE
        ) == PackageManager.PERMISSION_GRANTED) {
            Intent intent = new Intent();
            intent.setType("image/*");
            intent.setAction(Intent.ACTION_GET_CONTENT);
            getImage.launch(intent);
        }else  {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, 1);
        }
    }
    // Result when get Image
    ActivityResultLauncher<Intent> getImage = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(),
            new ActivityResultCallback<ActivityResult>() {
                @Override
                public void onActivityResult(ActivityResult result) {
                    if(result.getResultCode() == Activity.RESULT_OK) {
                        Intent data = result.getData();
                        Uri imagePath = data.getData();
                            file = createFileFromUri(imagePath, "avatar");
                        Glide.with(RegisterActivity.this)
                                .load(file)
                                .thumbnail(Glide.with(RegisterActivity.this).load(R.mipmap.ic_launcher))
                                .centerCrop()
                                .circleCrop()
                                .diskCacheStrategy(DiskCacheStrategy.NONE) //clear cache
                                .skipMemoryCache(true)
                                .into(binding.avatar);
                    }
                }
            }
    );
    // create file image
    private File createFileFromUri(Uri path, String name )
    {
        File _file = new File(RegisterActivity.this.getCacheDir(), name+".png");
        try {
            InputStream in = RegisterActivity.this.getContentResolver().openInputStream(path);
            OutputStream out = new FileOutputStream(_file);
            byte[] buf = new byte[1024];
            int len;
            while((len = in.read(buf))>0) {
                out.write(buf, 0, len);
            }
            out.close();
            in.close();
            return _file;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
    Callback<Response<User>> responseUser = new Callback<Response<User>>() {
        @Override
        public void onResponse(Call<Response<User>> call, retrofit2.Response<Response<User>> response) {
            if(response.isSuccessful()) {
                if(response.body().getStatus() == 200) {
                    Toast.makeText(RegisterActivity.this, "Register successful", Toast.LENGTH_SHORT).show();
                }
            }
        }

        @Override
        public void onFailure(Call<Response<User>> call, Throwable t) {
            Log.d(">>GetListDistributor", "onFailure" + t.getMessage());
        }
    };
}