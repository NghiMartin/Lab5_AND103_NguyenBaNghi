package com.example.lab5_and103;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.lab5_and103.adapter.DistributorAdapter;
import com.example.lab5_and103.databinding.ActivityMainBinding;
import com.example.lab5_and103.databinding.DialogAddBinding;
import com.example.lab5_and103.model.Distributor;
import com.example.lab5_and103.model.Response;
import com.example.lab5_and103.services.HttpRequest;


import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;


public class MainActivity extends AppCompatActivity implements DistributorAdapter.DistributorClick {
    private ActivityMainBinding binding;
    private HttpRequest httpRequest;
    private ArrayList<Distributor> list = new ArrayList<>();
    private DistributorAdapter adapter;
    private static final String TAG = "MainActivity";
    private ProgressDialog progressDialog;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        super.onCreate(savedInstanceState);
        setContentView(binding.getRoot());
        TextView Load = findViewById(R.id.txtLoadLai);
        fetchAPI();
        userListener();
        Load.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                fetchAPI();
            }
        });
    }

    private void fetchAPI() {
        progressDialog = new ProgressDialog(this);
        progressDialog.setTitle("Loading...");
        progressDialog.setCanceledOnTouchOutside(false);
        progressDialog.show();

        httpRequest = new HttpRequest();
        httpRequest.callAPI()
                .getListDistributor()
                .enqueue(getDistributorAPI);
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                progressDialog.dismiss();
            }
        }, 3000);


    }

    private void userListener() {
        binding.edSearch.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                if (actionId == EditorInfo.IME_ACTION_SEARCH) {

                    String key = binding.edSearch.getText().toString().trim();
                    httpRequest.callAPI()
                            .searchDistributor(key)
                            .enqueue(getDistributorAPI);
                    Log.d(TAG, "onEditorAction: " + key);
                    return true;
                }
                return false;
            }
        });

        binding.btnAdd.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showDialogAdd();
            }
        });
    }

    private void showDialogAdd() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Add distributor");
        DialogAddBinding binding1 = DialogAddBinding.inflate(LayoutInflater.from(this));
        builder.setView(binding1.getRoot());
        AlertDialog alertDialog = builder.create();
        binding1.btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String name = binding1.etName.getText().toString().trim();
                if (name.isEmpty()) {
                    Toast.makeText(MainActivity.this, "you must enter name", Toast.LENGTH_SHORT).show();
                } else {
                    Distributor distributor = new Distributor();
                    distributor.setName(name);
                    httpRequest.callAPI()
                            .addDistributor(distributor)
                            .enqueue(responseDistributorAPI);
                    fetchAPI();
                    alertDialog.dismiss();
                    progressDialog.dismiss();

                }
            }
        });
        alertDialog.show();
    }


    public void getData() {
        adapter = new DistributorAdapter(list, this, this);
        binding.rcvDistributor.setAdapter(adapter);
        progressDialog.dismiss();
    }

    Callback<Response<ArrayList<Distributor>>> getDistributorAPI = new Callback<Response<ArrayList<Distributor>>>() {
        @Override
        public void onResponse(Call<Response<ArrayList<Distributor>>> call, retrofit2.Response<Response<ArrayList<Distributor>>> response) {
            if (response.isSuccessful()) {
                if (response.body().getStatus() == 200) {
                    list = response.body().getData();
                    getData();
                    Log.d(TAG, "onResponse: " + list.size());
                }
            }
        }

        @Override
        public void onFailure(Call<Response<ArrayList<Distributor>>> call, Throwable t) {
            Log.e(TAG, "onFailure: " + t.getMessage());
            progressDialog.dismiss();

        }


    };


    Callback<Response<Distributor>> responseDistributorAPI = new Callback<Response<Distributor>>() {
        @Override
        public void onResponse(Call<Response<Distributor>> call, retrofit2.Response<Response<Distributor>> response) {
            if (response.isSuccessful()) {
                if (response.body().getStatus() == 200) {
                    httpRequest.callAPI()
                            .getListDistributor()
                            .enqueue(getDistributorAPI);
                    fetchAPI();
                    Toast.makeText(MainActivity.this, response.body().getMessenger(), Toast.LENGTH_SHORT).show();
                }
            }
        }

        @Override
        public void onFailure(Call<Response<Distributor>> call, Throwable t) {
            Log.e(TAG, "onFailure: " + t.getMessage());
            progressDialog.dismiss();

        }
    };

    private void showDialogEdit(Distributor distributor) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Edit distributor");
        DialogAddBinding binding1 = DialogAddBinding.inflate(LayoutInflater.from(this));
        builder.setView(binding1.getRoot());
        AlertDialog alertDialog = builder.create();

        binding1.etName.setText(distributor.getName());

        binding1.btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String name = distributor.getName();

                if (name.isEmpty()) {
                    Toast.makeText(MainActivity.this, "you must enter name", Toast.LENGTH_SHORT).show();
                } else {

                    Distributor distributor1 = new Distributor();
                    distributor1.setName(binding1.etName.getText().toString().trim());
                    httpRequest.callAPI()
                            .updateDistributor(distributor.getId(), distributor1)
                            .enqueue(responseDistributorAPI);
                    fetchAPI();
                    alertDialog.dismiss();
                }
            }
        });
        alertDialog.show();
    }

    @Override
    public void delete(Distributor distributor) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Confirm delete");
        builder.setMessage("Are you sure you want to delete?");
        builder.setPositiveButton("yes", (dialog, which) -> {
            httpRequest.callAPI()
                    .deleteDistributor(distributor.getId())
                    .enqueue(responseDistributorAPI);
            fetchAPI();
        });
        builder.setNegativeButton("no", (dialog, which) -> {
            dialog.dismiss();
        });
        builder.show();


    }

    @Override
    public void edit(Distributor distributor) {
        showDialogEdit(distributor);
    }
}

